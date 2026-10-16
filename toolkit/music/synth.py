"""Original royalty-free background music for Gorew social content.
Usage: python3 synth.py <style> <seconds> <out.wav>
styles: uplift | focus | pulse
"""
import sys, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100
rng = np.random.default_rng(7)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)

def lp(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR/2-100) / (SR/2), 'low', output='sos'), x)
def hp(x, fc, order=2):
    return sosfilt(butter(order, fc / (SR/2), 'high', output='sos'), x)
def bp(x, lo, hi):
    return sosfilt(butter(2, [lo/(SR/2), hi/(SR/2)], 'band', output='sos'), x)

def saw(f, n, phase=0.0):
    t = np.arange(n) / SR
    p = (f * t + phase) % 1.0
    return 2 * p - 1
def env_adsr(n, a, d, s, r):
    e = np.ones(n) * s
    A, D, R = int(a*SR), int(d*SR), int(r*SR)
    A = min(A, n); e[:A] = np.linspace(0, 1, A, endpoint=False)
    D2 = min(D, n - A); e[A:A+D2] = np.linspace(1, s, D2, endpoint=False)
    if R > 0 and R < n: e[-R:] *= np.linspace(1, 0, R)
    return e

def add(buf, x, start):
    s = int(start)
    if s >= len(buf): return
    e = min(len(buf), s + len(x)); buf[s:e] += x[:e - s]

def reverb(x, secs=2.2, mix=0.25):
    n = int(secs * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lp(ir, 6000); ir /= np.sqrt(np.sum(ir**2))
    wet = fftconvolve(x, ir)[:len(x)]
    return x * (1 - mix) + wet * mix * 0.9

STYLES = {
  # bpm, chords (root midi + intervals), key feel, drum density
  'uplift': dict(bpm=104, chords=[(60,[0,4,7,11]),(55,[0,4,7,14]),(57,[0,3,7,10]),(53,[0,4,7,9])], drums='full', arp=[0,2,1,3,2,1,3,2]),
  'focus':  dict(bpm=96,  chords=[(57,[0,3,7,10]),(53,[0,4,7,11]),(60,[0,4,7,9]),(55,[0,4,7,14])], drums='light', arp=[0,1,2,3,2,1,0,2]),
  'pulse':  dict(bpm=112, chords=[(62,[0,3,7,10]),(58,[0,4,7,11]),(53,[0,4,7,9]),(60,[0,4,7,14])], drums='full', arp=[0,3,2,3,1,3,2,3]),
}

def render(style, seconds):
    st = STYLES[style]
    bpm = st['bpm']; beat = 60 / bpm; bar = 4 * beat
    N = int((seconds + 2.5) * SR)
    pad = np.zeros(N); pl = np.zeros(N); bass = np.zeros(N); drums = np.zeros(N); duck = np.ones(N)
    nbars = int(np.ceil(seconds / bar)) + 1
    intro_bars = 1
    for b in range(nbars):
        root, iv = st['chords'][b % 4]
        t0 = b * bar * SR
        # pad: detuned saws
        n = int(bar * SR) + int(0.6*SR)
        p = np.zeros(n)
        for k in iv:
            f = midi(root + k)
            for det in (-0.08, 0.0, 0.07):
                p += saw(f * 2 ** (det / 12), n, rng.random())
        p = lp(p, 1400 + 500 * np.sin(b * 0.9)) * env_adsr(n, 0.35, 0.4, 0.8, 0.7) * 0.06
        add(pad, p, t0)
        # bass: root on 8ths with pump
        for e8 in range(8):
            nb = int(beat/2 * SR * 0.92)
            f = midi(root - 24)
            x = (np.sin(2*np.pi*f*np.arange(nb)/SR) * 0.8 + lp(saw(f, nb), 500) * 0.35)
            x *= env_adsr(nb, 0.005, 0.12, 0.6, 0.05) * (0.22 if e8 % 2 else 0.16)
            if b >= intro_bars: add(bass, x, t0 + e8 * beat/2 * SR)
        # pluck arpeggio 16ths in upper octave
        notes = [root + 12 + iv[i % len(iv)] for i in st['arp']]
        for s16 in range(16):
            nn = notes[s16 % 8]
            nb = int(0.32 * SR)
            f = midi(nn)
            x = saw(f, nb) * 0.6 + np.sign(np.sin(2*np.pi*f*np.arange(nb)/SR)) * 0.3
            x = lp(x, 3200) * np.exp(-np.arange(nb) / (0.07 * SR)) * 0.09
            vel = 1.0 if s16 % 4 == 0 else 0.7
            if b >= intro_bars or s16 % 2 == 0: add(pl, x * vel, t0 + s16 * beat/4 * SR)
        # drums
        brk = seconds > 40 and (b % 16) in (14, 15)
        if b >= intro_bars and not brk:
            for q in range(4):
                tq = t0 + q * beat * SR
                # kick
                nk = int(0.35 * SR); tt = np.arange(nk) / SR
                fk = 48 + 110 * np.exp(-tt * 28)
                k = np.sin(2*np.pi*np.cumsum(fk)/SR) * np.exp(-tt * 11) * 0.45
                if st['drums'] == 'full' or q in (0, 2):
                    add(drums, k, tq)
                    dk = 1 - 0.55 * np.exp(-np.arange(int(beat*SR)) / (0.11*SR))
                    s = int(tq); e = min(N, s + len(dk))
                    if e > s: duck[s:e] = np.minimum(duck[s:e], dk[:e-s])
                # clap on 2,4
                if q in (1, 3):
                    nc = int(0.25 * SR)
                    c = bp(rng.standard_normal(nc), 900, 5000) * np.exp(-np.arange(nc)/(0.045*SR)) * 0.2
                    add(drums, c, tq)
                # hats offbeat
                nh = int(0.06 * SR)
                h = hp(rng.standard_normal(nh), 7000) * np.exp(-np.arange(nh)/(0.012*SR)) * (0.11 if st['drums']=='full' else 0.07)
                add(drums, h, tq + beat/2 * SR)
                if st['drums'] == 'full':
                    add(drums, h * 0.5, tq + beat/4*3 * SR)
    mus = reverb(pad * duck + pl * (0.6 + 0.4 * duck), 2.4, 0.32) + bass * duck + reverb(drums, 0.8, 0.08)
    mus = hp(mus, 30)
    mus = mus[:int(seconds * SR)]
    # fades
    fi = int(0.8 * SR); fo = int(1.6 * SR)
    mus[:fi] *= np.linspace(0, 1, fi); mus[-fo:] *= np.linspace(1, 0, fo) ** 1.5
    mus = np.tanh(mus * 1.4) / np.tanh(1.4)
    mus = mus / (np.max(np.abs(mus)) + 1e-9) * 0.89
    stereo = np.stack([mus, np.roll(mus, int(0.011 * SR)) * 0.97 + mus * 0.03], 1)
    return stereo

if __name__ == '__main__':
    style, secs, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    wavfile.write(out, SR, (render(style, secs) * 32767).astype(np.int16))
    print('ok', out)
