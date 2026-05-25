export default function handler(req, res) {

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    function generateKey(length) {
        let result = "";

        for (let i = 0; i < length; i++) {
            result += chars.charAt(
                Math.floor(Math.random() * chars.length)
            );
        }

        return result;
    }

    // Generates same key every 12 hours
    const currentPeriod = Math.floor(Date.now() / (1000 * 60 * 60 * 12));

    // Simple deterministic random
    const seeded = currentPeriod.toString();

    let finalKey = "ADDY-";

    for (let i = 0; i < seeded.length; i++) {
        finalKey += generateKey(1);
    }

    finalKey += "-" + generateKey(6);

    res.status(200).json({
        key: finalKey
    });
}
