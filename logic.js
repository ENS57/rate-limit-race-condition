const { db } = require('./db');

// --- ZAFİYETLİ FONKSİYON ---
const claimVulnerable = (callback) => {
    db.get("SELECT coupon_limit FROM users WHERE id = 1", (err, row) => {
        console.log(`[KONTROL] Mevcut Limit: ${row.coupon_limit}`);
        
        if (row.coupon_limit > 0) {
            console.log(">>> Zafiyetli: Limit var, 3 saniye bekleniyor...");
            setTimeout(() => {
                db.run("UPDATE users SET coupon_limit = coupon_limit - 1 WHERE id = 1", () => {
                    console.log("BAŞARILI: Kupon Verildi (Zafiyetli)");
                    callback(null);
                });
            }, 3000);
        } else {
            console.log("RED: Limit bitti!");
            callback(new Error("Limit Dolu"));
        }
    });
};

// --- GÜVENLİ FONKSİYON ---
const claimSecure = (callback) => {
    db.run(
        "UPDATE users SET coupon_limit = coupon_limit - 1 WHERE id = 1 AND coupon_limit > 0",
        function(err) {
            if (this.changes > 0) {
                console.log("BAŞARILI: Kupon Verildi (Güvenli)");
                callback(null);
            } else {
                console.log("RED: Güvenli sistem engelledi!");
                callback(new Error("Limit Dolu"));
            }
        }
    );
};

module.exports = { claimVulnerable, claimSecure };