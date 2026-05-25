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

    const period = Math.floor(Date.now() / (1000 * 60 * 60 * 12));

    const stableKey = generateStableKey(period);

    res.setHeader("Content-Type", "text/html");

    res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>ADDY HUB KEY</title>

        <style>

            body{
                background:#0d1117;
                color:white;
                font-family:sans-serif;
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
                margin:0;
            }

            .box{
                background:#161b22;
                padding:40px;
                border-radius:16px;
                text-align:center;
                width:320px;
                box-shadow:0 0 20px rgba(0,0,0,0.4);
            }

            h1{
                margin-top:0;
                color:#58a6ff;
            }

            .key{
                background:#0d1117;
                padding:15px;
                border-radius:10px;
                font-size:20px;
                margin:20px 0;
                word-break:break-all;
            }

            button{
                background:#238636;
                color:white;
                border:none;
                padding:12px 20px;
                border-radius:10px;
                font-size:16px;
                cursor:pointer;
                width:100%;
            }

            button:hover{
                background:#2ea043;
            }

            .small{
                margin-top:15px;
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

            <button onclick="copyKey()">
                COPY KEY
            </button>

            <div class="small">
                Key expires in 12 hours
            </div>

        </div>

        <script>

            function copyKey(){

                const key =
                    document.getElementById("key").innerText;

                navigator.clipboard.writeText(key);

                alert("Key copied!");
            }

        </script>

    </body>
    </html>
    `);
}
