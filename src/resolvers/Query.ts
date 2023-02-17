import { Context } from "../index"
export const Query = {
    hello: () => {
        return 213;
    },
    posts: async (parents: any, args: any, { prisma, userInfo }: Context) => {
        if (userInfo == null) {
            return {
                userErrors: [{
                    message: "Unauthenticated Access"
                }],
                post: null
            }
        }
        const posts = await prisma.posts.findMany({
            orderBy: [
                {
                    id: "asc"
                }
            ]
        })
        
        return {
            userErrors: [],
            post: () => {
                return posts.map((val, key) => {
                    const ids = BigInt(val.id).toString();
                    return { ...val, id: ids }
                })
            }
        }
    }
}