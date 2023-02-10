import { Context } from "../index"
export const Query = {
    hello: () => {
        return 213;
    },
    posts: (parents: any, args: any, {prisma}: Context) => {
        return prisma.posts.findMany({
            orderBy: [
                {
                    id: "asc"
                }
            ]
        });
    }
}