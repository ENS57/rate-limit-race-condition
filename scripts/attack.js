const axios = require('axios');

const BASE = "http://localhost:3000";
const TOTAL_REQUESTS = 50;

const runAttack = async (endpoint, label) => {
    console.log(`\n🚀 ${label} attack başlıyor...\n`);

    let success = 0;
    let fail = 0;

    const promises = [];

    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        promises.push(
            axios.get(`${BASE}${endpoint}`)
                .then(() => {
                    success++;
                })
                .catch(() => {
                    fail++;
                })
        );
    }

    await Promise.all(promises);

    console.log(`\n📊 ${label} SONUÇ:`);
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Fail: ${fail}`);

    return { success, fail };
};

const resetSystem = async () => {
    await axios.post(`${BASE}/api/reset`);
    console.log("🔄 Sistem resetlendi\n");
};

const main = async () => {
    // VULNERABLE TEST
    await resetSystem();
    const vuln = await runAttack('/api/claim/vulnerable', 'VULNERABLE');

    // SECURE TEST
    await resetSystem();
    const secure = await runAttack('/api/claim/secure', 'SECURE');

    console.log("\n==============================");
    console.log("🔥 KARŞILAŞTIRMA:");
    console.log(`Vulnerable Success: ${vuln.success}`);
    console.log(`Secure Success: ${secure.success}`);
    console.log("==============================\n");
};

main();