import { Context } from "../index"
export const Query = {
    me: (_:any, __:any, {prisma, userInfo}: Context) => {
        if (!userInfo) {
            return null;
        }
        return prisma.users.findUnique({
            where: {
                id: Number(userInfo.userID)
            }
        })
    },
    OtherProfile: (_: any, { UserID }: { UserID: string }, { prisma, userInfo }: Context)=>{
        
        if (!userInfo) {
            return null;
        }
        return prisma.profile.findUnique({
            where: {
                user_id: Number(UserID)
            }
        })
    },
    posts: async (parents: any, args: any, { prisma, userInfo }: Context) => {
        // if (userInfo == null) {
        //     return {
        //         userErrors: [{
        //             message: "Unauthenticated Access"
        //         }],
        //         post: null
        //     }
        // }
        const posts = await prisma.posts.findMany({
            orderBy: [
                {
                    id: "asc"
                }
            ]
        })
        
        return {
            userErrors: [],
            post: posts
        }
    }
}