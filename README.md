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
| `rec2.js` | `node rec2.js page.html 1080 1920 <sn> out.mp4` → 30 fps sessiz video; 2× süper örnekleme + lanczos küçültme, hafif doku (Instagram sıkıştırmasında bloklanmayı önler), CRF 14 (~0,55 sn/kare). Sona zaman yazılırsa (`... out 1.5 4`) sadece kare görüntüleri |
| `shots.js` | `node shots.js social/carousel.html c3 6 ../2026-w44` → carousel JPEG'leri (2× çizim, en yüksek JPEG kalitesi) |
| `music/synth.py` | `python3 music/synth.py <uplift|focus|pulse> <sn> out.wav` → özgün telifsiz müzik |
| `sheet.py` | Kare görüntülerinden kontrol sayfası |

Müzik ekleme: `ffmpeg -i v.mp4 -i m.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4`

## Hedef kitle (en önemli kural)

**Patronlar ve şirket sahipleri** — şirketinin iyiliğini isteyen, işin sonucundan sorumlu karar vericiler (KOBİ sahibi, genel müdür, ortak, departman yöneticisi). Çalışanlara değil, onlara konuşuyoruz.

- Bakış açısı: "Ekibimde neler oluyor, işler yürüyor mu, ben olmasam da sistem işler mi?" Patronun derdi kontrol, görünürlük, hesap verebilirlik, kaybolan zaman/para, risk (kaçan ruhsat, onaysız harcama), denetim ve büyürken düzeni korumak.
- Dil: siz dili, saygılı, net, iş sonucu odaklı. "Ekibinizin…", "şirketinizde…", "masanıza gelen…". Çalışanı suçlayan ya da gözetleme/mikro yönetim çağrışımı yapan ton yok; vurgu düzen, şeffaflık ve ekibin rahatlaması.
- Kanca örnekleri: "Siz tatildeyken işler kimde?", "Bu ay kaç onay e-postada bekledi?", "Ruhsat yenilemesi kaçarsa maliyeti ne?", "Şirket büyüdükçe WhatsApp grubu yetmiyor".
- CTA: demo / tanışma / www.gorew.com.tr — karar vericinin harekete geçeceği sade çağrı.
- Örnekler sahiplerin dünyasından: satın alma ve harcama onayı, fuar/proje organizasyonu, ruhsat-sözleşme takibi, dış danışman (mali müşavir, avukat) ile çalışma, birimler arası koordinasyon.

## Marka kuralları

- Uygulamanın kendi renk dili: zemin `#06080c`, kart `#171a21`, mavi `#4b67f6`, yeşil `#2bd47f`, kırmızı `#f0453a`, logo geçişi `#00f591 → #00a3ff`.
- Yazı tipi Inter / Inter Display. Başlıkta ikinci satır geçişli renk (`.grad`).
- Gerçek uygulama ekranları `assets/` içinde (ph_* = 3B telefon, s_* = düz ekran, monitor.png, av1-4 = avatarlar).
- Dikey videolarda yazılar y=250–1500 arasında kalmalı (Instagram arayüzü üst/alt kısmı kapatır).
- Ton: sakin, net, kurumsal ama samimi. Abartılı vaat yok. Rakamlar yalnızca sunumdakiler: 90.000+ görev, 23.000+ onay, 450 kullanıcı, %99,9 erişilebilirlik, KVKK, 256-bit şifreleme.
- Web: www.gorew.com.tr
