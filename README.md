# gorew-social

Gorew (@gorew.app) Instagram içerik dosyaları. Buradaki görseller ve videolar Metricool üzerinden Instagram'a planlanır; Metricool dosyaları `raw.githubusercontent.com` bağlantılarından çeker.

- `2026-wNN/` — haftalık içerikler (`plan.json`: tarih, tür, medya, açıklama)
- `toolkit/` — içerik üretim araçları (aşağıda)
- `CONTENT_LOG.md` — yayınlanan konuların listesi (tekrar etmemek için)

## Toolkit

| Dosya | İş |
|---|---|
| `social/common.css`, `social/common.js` | Marka stilleri ve animasyon/bileşen yardımcıları (bildirim kartı, zincir onay kartı, rutin satırları, logo) |
| `social/carousel.html?d=<deste>&s=<n>` | 1080×1350 kaydırmalı gönderi sayfaları; yeni deste = `DECKS` nesnesine yeni anahtar |
| `social/reel1.html`, `reel2.html`, `story1.html` | 1080×1920 dikey video şablonları; `render(t)` kare kare zaman fonksiyonu |
| `rec2.js` | `node rec2.js page.html 1080 1920 <sn> out.mp4` → 30 fps sessiz video; sona zaman yazılırsa (`... out 1.5 4`) sadece kare görüntüleri |
| `shots.js` | `node shots.js social/carousel.html c3 6 ../2026-w44` → carousel JPEG'leri |
| `music/synth.py` | `python3 music/synth.py <uplift|focus|pulse> <sn> out.wav` → özgün telifsiz müzik |
| `sheet.py` | Kare görüntülerinden kontrol sayfası |

Müzik ekleme: `ffmpeg -i v.mp4 -i m.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4`

## Marka kuralları

- Uygulamanın kendi renk dili: zemin `#06080c`, kart `#171a21`, mavi `#4b67f6`, yeşil `#2bd47f`, kırmızı `#f0453a`, logo geçişi `#00f591 → #00a3ff`.
- Yazı tipi Inter / Inter Display. Başlıkta ikinci satır geçişli renk (`.grad`).
- Gerçek uygulama ekranları `assets/` içinde (ph_* = 3B telefon, s_* = düz ekran, monitor.png, av1-4 = avatarlar).
- Dikey videolarda yazılar y=250–1500 arasında kalmalı (Instagram arayüzü üst/alt kısmı kapatır).
- Ton: sakin, net, kurumsal ama samimi. Abartılı vaat yok. Rakamlar yalnızca sunumdakiler: 90.000+ görev, 23.000+ onay, 450 kullanıcı, %99,9 erişilebilirlik, KVKK, 256-bit şifreleme.
- Web: www.gorew.com.tr
