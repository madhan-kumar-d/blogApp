import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

import { typeDefs } from "./schema"
import { Query, Mutation } from "./resolvers"

import { PrismaClient } from "@prisma/client"
import { GetUserByToken } from "./utils/getUserByToken"
// import { context } from "./context"
const prisma = new PrismaClient();
export interface Context {
    prisma: PrismaClient,
    userInfo: {
        userID: number;
    } | null
}
const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation
    }
});
let data = async () => {
    const data = await startStandaloneServer(server, {
        context: async ({req}:any): Promise<Context> => {
            const token = req.headers.authorization;
            const userInfo = await GetUserByToken(token);
            return ({
                prisma,
                userInfo
            })
        },
        listen: { port: 1000 }
    })
    console.log(data);
}
data();
