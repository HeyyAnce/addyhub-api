import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req,res){

    if(req.method!=="POST"){

        return res.status(405).json({
            success:false,
            message:"METHOD_NOT_ALLOWED"
        });
    }

    try{

        const { hwid } = req.body;

        if(!hwid){

            return res.status(400).json({
                success:false,
                message:"NO_HWID"
            });
        }

        const keys = await redis.keys("ADDY-*");

        for(const key of keys){

            const data = await redis.get(key);

            if(
                data &&
                data.hwid===hwid &&
                Date.now()<data.expires
            ){

                return res.status(200).json({
                    success:true,
                    expires:data.expires,
                    username:data.username
                });
            }
        }

        return res.status(401).json({
            success:false,
            message:"NO_SESSION"
        });

    }catch(e){

        console.log(e);

        return res.status(500).json({
            success:false,
            message:"SERVER_ERROR"
        });
    }
}