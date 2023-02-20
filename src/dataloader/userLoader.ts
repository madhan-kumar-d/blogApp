import { Users } from "@prisma/client";
import DataLoader from "dataloader";
import { prisma } from "..";


type BatchUsers = (ids: number[])=> Promise<Users[]>
const batchUsers: BatchUsers = async (ids) => {
    console.log(ids);
    
    const users = await prisma.users.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
    const userMap: { [key: string]: Users } = {};

    users.forEach((user) => {
        userMap[Number(user.id)] = user;
    });
    return ids.map((id) => userMap[id]);

}
// @ts-ignore
export const userLoader = new DataLoader<number, Users>(batchUsers);