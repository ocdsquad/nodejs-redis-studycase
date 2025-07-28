import Redis from "ioredis";
import { prismaClient } from "../application/database.js";

const redis = new Redis({
    host: "localhost",
    port: 6379,
    db: 0
});

const findAll = async (req, res, next) => {
    // query all categories parents
    try {
        /*
        check apakah data ada di redis?
        jika ada, kembalikan langsung data ke user
        jika tidak, query ke database lalu simpan ke redis 
        */

        const json = await redis.get("categories");

        if(json) return JSON.parse(json);

        const parents = await prismaClient.category.findMany({
            where: { parent_id: null },
            select: {
                id: true,
                name: true,
                children: true,
            }
        });


        //simpan ke redis
        await redis.setex("categories", 60*60, JSON.stringify(parents));
        
        // for (let parent of parents) {
        //     // query all categories children
        //     parent.children = await prismaClient.category.findMany({
        //         where: { parent_id: parent.id },
        //         select: {
        //             id: true,
        //             name: true,
        //         }
        //     });


        // }

        return parents;
    } catch (e) {
        next(e);
    }
}

export default {
    findAll
}