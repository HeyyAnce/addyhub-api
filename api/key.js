function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateStableKey(seed) {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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

    // Rotates every 12 hours
    const period =
        Math.floor(Date.now() / (1000 * 60 * 60 * 12));

    const stableKey = generateStableKey(period);

    res.setHeader("Content-Type", "text/html");

    res.status(200).send(`
    <!DOCTYPE html>

    <html>

    <head>

        <title>ADDY HUB KEY</title>

        <meta name="viewport"
        content="width=device-width, initial-scale=1.0"/>

        <style>

            body{
                margin:0;
                height:100vh;

                display:flex;
                justify-content:center;
                align-items:center;

                background:#0d1117;

                font-family:sans-serif;
                color:white;
            }

            .box{

                width:320px;

                background:#161b22;

                border-radius:18px;

                padding:35px;

                text-align:center;

                box-shadow:
                0 0 25px rgba(0,0,0,0.4);
            }

            h1{
                margin-top:0;
                color:#58a6ff;
                font-size:32px;
            }

            .key{

                background:#0d1117;

                padding:16px;

                border-radius:12px;

                margin:25px 0;

                font-size:22px;

                word-break:break-word;

                border:
                1px solid rgba(255,255,255,0.08);
            }

            button{

                width:100%;

                border:none;

                border-radius:12px;

                padding:14px;

                background:#238636;

                color:white;

                font-size:17px;

                cursor:pointer;

                transition:0.2s;
            }

            button:hover{
                background:#2ea043;
            }

            .small{

                margin-top:18px;

                color:#8b949e;

                font-size:14px;
            }

        </style>

    </head>

    <body>

        <div class="box">

            <h1>ADDY HUB</h1>

            <div class="key" id="key">
                ${stableKey}
            </div>

            <button onclick="copyKey()"
            id="copyButton">

                COPY KEY

            </button>

            <div class="small">
                Key rotates every 12 hours
            </div>

        </div>

        <script>

            function copyKey(){

                const key =
                    document.getElementById("key").innerText;

                navigator.clipboard.writeText(key);

                const button =
                    document.getElementById("copyButton");

                button.innerText = "COPIED ✓";

                setTimeout(() => {

                    button.innerText = "COPY KEY";

                }, 1200);
            }

        </script>

    </body>

    </html>
    `);
}
