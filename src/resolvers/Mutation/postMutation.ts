import { Context } from "../../index"
import { Prisma, Posts } from "@prisma/client"

interface PostArgs {
    post: {
        title?: string
        desc?: string
    }
}

interface PostResponse {
    userErrors: {
        message: string;
    }[];
    post: Prisma.Prisma__PostsClient<Posts, never>| null 
}

export const postMutation = {
    postCreate: async(_: any, { post }:PostArgs, { prisma }: Context): Promise<PostResponse> => {
        const { title, desc } = post;
        console.log(title);
        
        if (!title) {
            return {
                userErrors: [{
                    message: "You must provide some title to create"
                }],
                post: null
            }
        }
        try {
            return {
                userErrors: [],
                post: prisma.posts.create({
                    data: {
                        title,
                        desc,
                        user_id: 1
                    }
                })
            }
        }
        catch (e:any) {
            return {
                userErrors: [{
                    message: e.message
                }],
                post: null
            }
        }
    },
    postUpdate: async (_:any, { postID, post }: {postID:string, post: PostArgs['post']}, {prisma}: Context): Promise<PostResponse> => {
        const { title, desc } = post;
        const postExist = await prisma.posts.findUnique({
            where: {
                id: Number(postID)
            }
        });
        if (!postExist) {
            return {
                userErrors: [{
                    message: "Post Doesn't exist"
                }],
                post: null
            };
        }
        let postData = {
            title,
            desc
        }
        if (!title) delete postData.title
        if (!desc) delete postData.desc
        return {
            userErrors: [],
            post: prisma.posts.update({
                data: {
                    ...postData
                },
                where: {
                    id: Number(postID)
                }
            })
        }
    },
    postDelete: async (_: any, { postID }: { postID: string }, { prisma }: Context) => {
        const postExist = await prisma.posts.findUnique({
            where: {
                id: Number(postID),
            }
        })
        console.log(postExist);
        if (!postExist) {
            return {
                userErrors: [{
                    message: "Post Doesn't exist"
                }],
                post: null
            };
        }
        await prisma.posts.delete({
            where: {
                id: Number(postID),
            }
        });
        return {
            userErrors: [],
            post: postExist
        };
    }
}