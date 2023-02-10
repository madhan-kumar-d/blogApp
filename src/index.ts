import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

import { typeDefs } from "./schema"
import { Query, Mutation } from "./resolvers"

import { PrismaClient } from "@prisma/client"
// import { context } from "./context"
const prisma = new PrismaClient();
export interface Context {
    prisma: PrismaClient
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
        context: async () => ({
            prisma,
        }),
        listen: { port: 1000 }
    })
    console.log(data);
}
data();
