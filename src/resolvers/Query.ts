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
    profile: async (_: any, { UserID }: { UserID: string }, { prisma, userInfo }: Context)=>{
        
        if (!userInfo) {
            return null;
        }
        const isMyProfile = (userInfo.userID === Number(UserID)) ? true : false;
        const ProfileData = await prisma.profile.findUnique({
            where: {
                user_id: Number(UserID)
            }
        })

        return {
            isMyProfile,
            ...ProfileData
        }
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
        return posts;
        // return {
        //     userErrors: [],
        //     post: posts
        // }
    }
}