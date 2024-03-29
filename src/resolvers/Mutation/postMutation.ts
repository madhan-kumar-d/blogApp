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
    postCreate: async(_: any, { post }:PostArgs, { prisma, userInfo }: Context): Promise<PostResponse> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Unauthenticated Access"
                }],
                post: null
            }
        }
        const { title, desc } = post;
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
                        user_id: Number(userInfo.userID)
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
    postUpdate: async (_: any, { postID, post }: { postID: string, post: PostArgs['post'] }, { prisma, userInfo }: Context): Promise<PostResponse> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Unauthenticated Access"
                }],
                post: null
            }
        }
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
        if (postExist.user_id !== userInfo.userID) {
            return {
                userErrors: [{
                    message: "You are not owner for this Post"
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
    postDelete: async (_: any, { postID }: { postID: string }, { prisma, userInfo }: Context) => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Unauthenticated Access"
                }],
                post: null
            }
        }
        const postExist = await prisma.posts.findUnique({
            where: {
                id: Number(postID),
            }
        })
        if (!postExist) {
            return {
                userErrors: [{
                    message: "Post Doesn't exist"
                }],
                post: null
            };
        }
        if (postExist.user_id !== userInfo.userID) {
            return {
                userErrors: [{
                    message: "You are not owner for this Post"
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
    },
    postPublish: async (_:any, {postID}: {postID:string}, {prisma, userInfo}: Context) => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Unauthenticated Access"
                }],
                post: null
            }
        }
        const postExist = await prisma.posts.findUnique({
            where: {
                id: Number(postID),
            }
        })
        if (!postExist || !postID) {
            return {
                userErrors: [{
                    message: "Post Doesn't exist"
                }],
                post: null
            };
        }
        if (postExist.user_id !== userInfo.userID) {
            return {
                userErrors: [{
                    message: "You are not owner for this Post"
                }],
                post: null
            };
        }
        const resp = await prisma.posts.update({
            data: {
                isPublished: true,
            },
            where: {
                id: Number(postID),
            }
        })
        console.log(resp);
        return {
            userErrors: [{
                message: ""
            }],
            post: prisma.posts.findUnique({
                where: {
                    id: Number(postID),
                }
            })
        };
    },
    postUnpublish: async (_:any, {postID}: {postID:string}, {prisma, userInfo}: Context) => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Unauthenticated Access"
                }],
                post: null
            }
        }
        const postExist = await prisma.posts.findUnique({
            where: {
                id: Number(postID),
            }
        })
        if (!postExist || !postID) {
            return {
                userErrors: [{
                    message: "Post Doesn't exist"
                }],
                post: null
            };
        }
        if (postExist.user_id !== userInfo.userID) {
            return {
                userErrors: [{
                    message: "You are not owner for this Post"
                }],
                post: null
            };
        }
        const resp = await prisma.posts.update({
            data: {
                isPublished: false,
            },
            where: {
                id: Number(postID),
            }
        })
        console.log(resp);
        return {
            userErrors: [{
                message: ""
            }],
            post: prisma.posts.findUnique({
                where: {
                    id: Number(postID),
                }
            })
        };
    },
}