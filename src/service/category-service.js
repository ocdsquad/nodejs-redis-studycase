import { prismaClient } from "../application/database.js";

const findAll = async (req, res, next) => {
    // query all categories parents
    try {
        const parents = await prismaClient.category.findMany({
            where: { parent_id: null },
            select: {
                id: true,
                name: true,
                children: true,
            }
        });


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