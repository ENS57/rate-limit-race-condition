const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// DB INIT
const initDB = () => {
    db.serialize(() => {
        // tabloyu temiz başlat
        db.run("DROP TABLE IF EXISTS users");

        db.run(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                coupon_limit INTEGER
            )
        `);

        // başlangıç limiti (race condition için yüksek)
        const INITIAL_LIMIT = 5;

        db.run(
            "INSERT INTO users (id, coupon_limit) VALUES (?, ?)",
            [1, INITIAL_LIMIT]
        );

        console.log(`💾 Veritabanı hazırlandı (Limit: ${INITIAL_LIMIT})`);
    });
};

module.exports = { db, initDB };