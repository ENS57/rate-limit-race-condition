# 🚀 Rate Limit Race Condition Lab

## 📌 Proje Amacı

Bu proje, backend sistemlerde oluşabilecek **Race Condition (yarış durumu)** zafiyetini göstermek ve güvenli bir çözüm ile karşılaştırmak amacıyla geliştirilmiştir.

Amaç, eş zamanlı (concurrent) isteklerin sistem limitlerini nasıl bypass edebileceğini pratik olarak göstermektir.

---

## 🎯 Özellikler

- 🔴 Zafiyetli endpoint (race condition)
- 🟢 Güvenli endpoint (atomic işlem)
- 💣 Otomatik saldırı simülasyonu
- 📊 Metrics (başarı / başarısızlık takibi)
- 🔄 Resetlenebilir test ortamı

---

## 🧠 Teknik Açıklama

### 🔴 Zafiyetli Senaryo

Sistem şu şekilde çalışır:

1. Veriyi okur (SELECT)
2. Belirli süre bekler (race window)
3. Güncelleme yapar (UPDATE)

Bu bekleme süresinde birden fazla istek aynı veriyi okuyabilir.

👉 Sonuç:
**Limit aşılır ve sistem beklenenden fazla kupon verir**

---

### 🟢 Güvenli Senaryo

Güvenli yaklaşımda:

- Tek SQL sorgusu kullanılır
- Kontrol ve azaltma aynı anda yapılır

```sql
UPDATE users 
SET coupon_limit = coupon_limit - 1 
WHERE coupon_limit > 0

👉 Sonuç:
Race condition oluşmaz ve limit korunur

🧪 Test Senaryosu

Aynı anda çok sayıda istek gönderildiğinde:

Vulnerable endpoint → limit aşılır
Secure endpoint → limit korunur

🚀 Kurulum
npm install
npm start
💣 Saldırı Simülasyonu
npm run attack
📊 Beklenen Sonuç
Mod	Sonuç
Vulnerable	Limit aşılır
Secure	Limit korunur

📁 Proje Yapısı
src/
  ├── db/
  ├── logic/
scripts/
docs/
server.js

📄 Dokümantasyon

Detaylı analiz:
docs/analysis.txt

📜 Lisans

MIT License

👨‍💻 Hazırlayan

ENES VAHİD ERDEMOĞLU
