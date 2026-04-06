const express = require('express');

// 🔥 YENİ PATHLER (yeni klasör yapısına uygun)
const { initDB, db } = require('./src/db/db');
const { claimVulnerable, claimSecure } = require('./src/logic/claim');

const app = express();
app.use(express.json());

// 🧪 başlangıç logu
console.log("🧪 Rate Limit Race Condition Lab başlatılıyor...");

// DB başlat
initDB();

// --- GLOBAL METRICS ---
let metrics = {
    vulnerableSuccess: 0,
    secureSuccess: 0,
    failed: 0
};

// --- LOG MIDDLEWARE ---
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- ROOT (ana sayfa) ---
app.get('/', (req, res) => {
    res.json({
        message: "Rate Limit Race Condition Lab",
        endpoints: [
            "/api/claim/vulnerable",
            "/api/claim/secure",
            "/api/metrics",
            "/api/reset",
            "/health"
        ]
    });
});

// --- HEALTH CHECK ---
app.get('/health', (req, res) => {
    res.json({
        status: "ok",
        service: "rate-limit-lab",
        time: new Date().toISOString()
    });
});

// --- ZAFİYETLİ ENDPOINT ---
app.get('/api/claim/vulnerable', (req, res) => {
    claimVulnerable((err) => {
        if (err) {
            metrics.failed++;
            return res.status(400).json({
                success: false,
                mode: "vulnerable",
                error: err.message
            });
        }

        metrics.vulnerableSuccess++;

        res.json({
            success: true,
            mode: "vulnerable",
            message: "Kupon alındı (zafiyetli)"
        });
    });
});

// --- GÜVENLİ ENDPOINT ---
app.get('/api/claim/secure', (req, res) => {
    claimSecure((err) => {
        if (err) {
            metrics.failed++;
            return res.status(400).json({
                success: false,
                mode: "secure",
                error: err.message
            });
        }

        metrics.secureSuccess++;

        res.json({
            success: true,
            mode: "secure",
            message: "Kupon alındı (güvenli)"
        });
    });
});

// --- METRICS ---
app.get('/api/metrics', (req, res) => {
    res.json({
        ...metrics,
        timestamp: new Date().toISOString()
    });
});

// --- RESET ---
const DEFAULT_LIMIT = 5;

app.post('/api/reset', (req, res) => {
    db.run(`UPDATE users SET coupon_limit = ${DEFAULT_LIMIT} WHERE id = 1`, () => {
        metrics = {
            vulnerableSuccess: 0,
            secureSuccess: 0,
            failed: 0
        };

        res.json({
            success: true,
            message: `Sistem resetlendi (limit: ${DEFAULT_LIMIT})`
        });
    });
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Sistem http://localhost:${PORT} adresinde aktif!`);
});