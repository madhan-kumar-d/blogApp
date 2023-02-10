// import { gql } from "apollo-server"
// export const typeDefs =  gql`
export const typeDefs = `#graphql
    type Query{
        hello: String
        posts: [Post!]
    }
    type Mutation {
        postCreate(post: PostInput!): postPayload
        postUpdate(postID: ID!,post: PostInput!): postPayload
        postDelete(postID: ID!): postPayload
    }
    type Post{
        id: ID!
        title: String!
        desc: String
        createAt: String!
        isPublished: Boolean!
    }
    type Users{
        id: ID!
        name: String!
        email: String!
        createAt: String!
        posts: [Post!]
    }
    type Profile{
        id: ID!
        bio: String!
        createAt: String!
        users: Users!
    }
    type userErrors{
        message: String
    }
    type postPayload{
        userErrors: [userErrors!]!
        post: Post
    }
    input PostInput {
        title: String
        desc: String
    }

`