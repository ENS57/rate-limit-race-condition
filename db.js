const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Tabloyu oluştur ve başlangıç verisini ekle
const initDB = () => {
    db.serialize(() => {
        db.run("CREATE TABLE users (id INTEGER, coupon_limit INTEGER)");
        db.run("INSERT INTO users VALUES (1, 1)");
        console.log("Veritabanı hazırlandı (Limit: 1)");
    });
};

module.exports = { db, initDB };