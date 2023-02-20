import { Context } from "..";
import { userLoader } from "../dataloader/userLoader";


interface PostParentType{
    user_id : number,
}
export const Post = {
    users: ({ user_id }: PostParentType, _: any, { prisma, userInfo }: Context) => {
        // return prisma.users.findUnique({
        //     where: {
        //         id: Number(user_id),
        //     }
        // })
        return userLoader.load(Number(user_id));
    }
}