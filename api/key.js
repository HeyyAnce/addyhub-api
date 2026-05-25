function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateStableKey(seed) {

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let key = "ADDY-";

    for (let i = 0; i < 12; i++) {

        const randomIndex = Math.floor(
            seededRandom(seed + i) * chars.length
        );

        key += chars[randomIndex];

        if (i === 3 || i === 7) {
            key += "-";
        }
    }

    return key;
}

export default function handler(req, res) {

    // 12 hour rotation
    const period = Math.floor(Date.now() / (1000 * 60 * 60 * 12));

    const stableKey = generateStableKey(period);

    res.status(200).json({
        key: stableKey,
        expiresInHours: 12
    });
}
