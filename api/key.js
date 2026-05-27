import crypto from "crypto";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

function generateKey() {

    const raw = crypto
        .randomBytes(8)
        .toString("hex")
        .toUpperCase();

    return (
        "ADDY-" +
        raw.match(/.{1,4}/g).join("-")
    );
}

export default async function handler(req,res) {

    // =========================
    // WEBSITE MODE
    // =========================
    if (req.method === "GET") {

        const key = generateKey();

        const expires = Date.now() + (
            12 * 60 * 60 * 1000
        );

        await redis.set(
            key,
            {
                used:false,
                hwid:null,
                username:null,
                expires
            },
            {
                ex:43200
            }
        );

        return res.status(200).send(`

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

    width:340px;

    background:#161b22;

    border-radius:18px;

    padding:35px;

    text-align:center;

    box-shadow:
    0 0 25px rgba(0,0,0,0.4);
}

h1{

    margin-top:0;

    color:#ff4da6;

    font-size:32px;
}

.key{

    background:#0d1117;

    padding:16px;

    border-radius:12px;

    margin:25px 0;

    font-size:20px;

    word-break:break-word;

    border:
    1px solid rgba(255,255,255,0.08);
}

button{

    width:100%;

    border:none;

    border-radius:12px;

    padding:14px;

    background:#ff4da6;

    color:white;

    font-size:17px;

    cursor:pointer;

    transition:0.2s;
}

button:hover{

    background:#ff66b3;
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
${key}
</div>

<button onclick="copyKey()"
id="copyButton">

COPY KEY

</button>

<div class="small">

Key valid for 12 hours.<br>
Can only be used on one device.

</div>

</div>

<script>

function copyKey(){

    const key=
        document.getElementById("key").innerText;

    navigator.clipboard.writeText(key);

    const button=
        document.getElementById("copyButton");

    button.innerText="COPIED ✓";

    setTimeout(()=>{

        button.innerText="COPY KEY";

    },1200);
}

</script>

</body>

</html>

        `);
    }

    // =========================
    // AUTH MODE
    // =========================
    if (req.method === "POST") {

        try {

            const {
                key,
                hwid,
                username
            } = req.body;

            if (!key || !hwid) {

                return res.status(400).json({
                    success:false,
                    message:"MISSING_FIELDS"
                });
            }

            const data = await redis.get(key);

            // Invalid key
            if (!data) {

                return res.status(401).json({
                    success:false,
                    message:"INVALID"
                });
            }

            // Expired
            if (Date.now() > data.expires) {

                await redis.del(key);

                return res.status(401).json({
                    success:false,
                    message:"EXPIRED"
                });
            }

            // First use
            if (!data.used) {

                data.used = true;
                data.hwid = hwid;
                data.username = username;

                await redis.set(
                    key,
                    data,
                    {
                        ex:43200
                    }
                );
            }

            // HWID mismatch
            if (data.hwid !== hwid) {

                return res.status(401).json({
                    success:false,
                    message:"HWID_MISMATCH"
                });
            }

            // Success
            return res.status(200).json({

                success:true,

                message:"VALID",

                token:crypto
                    .randomBytes(24)
                    .toString("hex"),

                expires:data.expires
            });

        } catch (e) {

            console.log(e);

            return res.status(500).json({

                success:false,

                message:"SERVER_ERROR"
            });
        }
    }

    return res.status(405).json({

        success:false,

        message:"METHOD_NOT_ALLOWED"
    });
}