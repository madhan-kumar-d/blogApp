import { Context } from "..";

interface UsersParentType{
    id : number,
}
export const Users = {
    posts: ({ id }: UsersParentType, _: any, { prisma, userInfo }: Context) => {
        if (id == userInfo?.userID) {
            return prisma.posts.findMany({
                where: {
                    user_id: Number(id)
                }
            })
        } else {
            return prisma.posts.findMany({
                where: {
                    user_id: Number(id),
                    isPublished: true,
                }
            })
        }
        
    }
}