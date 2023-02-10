import { ApolloServer, gql } from "apollo-server"

import { typeDefs } from "./schema"
import { Query, Mutation } from "./resolvers"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export interface Context = {
    prisma: PrismaClient

}
const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query
    }, 
    context: {
        prisma
    }
});
server.listen(1000).then((data) => {
    console.log(data.url);
})