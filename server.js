const express = require('express');
const { initDB } = require('./db');
const { claimVulnerable, claimSecure } = require('./logic');

const app = express();
initDB();

app.get('/claim-vulnerable', (req, res) => {
    claimVulnerable((err) => {
        if (err) res.status(400).send("HATA: " + err.message);
        else res.send("BAŞARILI: Kupon Alındı (Zafiyetli)");
    });
});

app.get('/claim-secure', (req, res) => {
    claimSecure((err) => {
        if (err) res.status(400).send("HATA: " + err.message);
        else res.send("BAŞARILI: Kupon Alındı (Güvenli)");
    });
});

app.listen(3000, () => console.log("Sistem http://localhost:3000 adresinde aktif!"));