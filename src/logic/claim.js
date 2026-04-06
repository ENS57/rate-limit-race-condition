const { db } = require('../db/db'); // <-- PATH DÜZELTİLDİ (yeni yapı)

// Simülasyon ayarları
const CONFIG = {
    artificialDelay: 3000, // ms → race condition için bilinçli gecikme
    enableVerbose: true
};

// Log helper
const log = (msg) => {
    if (CONFIG.enableVerbose) {
        console.log(`[${new Date().toISOString()}] ${msg}`);
    }
};

// -----------------------------
// RACE CONDITION (ZAFİYETLİ)
// -----------------------------
// Bu fonksiyon şu şekilde çalışır:
// 1. Veriyi okur (SELECT)
// 2. Belirli süre bekler (race window)
// 3. Sonra update eder
//
// Bu sırada birden fazla concurrent request:
// → aynı coupon_limit değerini okur
// → hepsi geçerli sanır
//
// SONUÇ:
// → limit aşılır (rate limit bypass)
// → klasik Race Condition zafiyeti oluşur
const claimVulnerable = (callback) => {
    const requestId = Math.random().toString(36).substring(7);

    log(`REQ-${requestId} → START`);

    db.get("SELECT coupon_limit FROM users WHERE id = 1", (err, row) => {
        if (err) return callback(err);

        log(`REQ-${requestId} → READ LIMIT: ${row.coupon_limit}`);

        if (row.coupon_limit > 0) {
            log(`REQ-${requestId} → PASS CHECK (WAITING ${CONFIG.artificialDelay}ms)`);

            // 🔴 Race window → burada diğer request'ler de aynı değeri okuyabilir
            setTimeout(() => {
                db.run(
                    "UPDATE users SET coupon_limit = coupon_limit - 1 WHERE id = 1",
                    function(err) {
                        if (err) return callback(err);

                        log(`REQ-${requestId} → UPDATE DONE (VULNERABLE)`);

                        callback(null);
                    }
                );
            }, CONFIG.artificialDelay);

        } else {
            log(`REQ-${requestId} → REJECTED (LIMIT 0)`);
            callback(new Error("Limit Dolu"));
        }
    });
};

// -----------------------------
// SECURE IMPLEMENTATION
// -----------------------------
// Bu yaklaşımda SELECT + UPDATE ayrı yapılmaz.
//
// Bunun yerine:
// → tek SQL sorgusu kullanılır
// → hem kontrol hem azaltma aynı anda yapılır
//
// "WHERE coupon_limit > 0" sayesinde:
// → atomic işlem sağlanır
// → race condition engellenir
const claimSecure = (callback) => {
    const requestId = Math.random().toString(36).substring(7);

    log(`REQ-${requestId} → START (SECURE)`);

    db.run(
        "UPDATE users SET coupon_limit = coupon_limit - 1 WHERE id = 1 AND coupon_limit > 0",
        function(err) {
            if (err) return callback(err);

            if (this.changes > 0) {
                log(`REQ-${requestId} → SUCCESS (SECURE)`);
                callback(null);
            } else {
                log(`REQ-${requestId} → BLOCKED (SECURE)`);
                callback(new Error("Limit Dolu"));
            }
        }
    );
};

module.exports = { claimVulnerable, claimSecure };