// import { gql } from "apollo-server"
// export const typeDefs =  gql`
export const typeDefs = `#graphql
    type Query{
        hello: String
        posts: postGetPayload
    }
    type Mutation {
        postCreate(post: PostInput!): postPayload
        postUpdate(postID: ID!,post: PostInput!): postPayload
        postDelete(postID: ID!): postPayload
        signup(email: String!, name:String!, password: String!, bio: String!): signupPayLoad!
        signin(email:String!, password:String!):signupPayLoad!
        verifyToken(token:String): verifyTokenPayLoad!
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
    type postGetPayload{
        userErrors: [userErrors!]!
        post: [Post!]
    }
    type signupPayLoad {
        userErrors: [userErrors!]!,
        token: String,
    }
    type verifyTokenPayLoad{
        status: Boolean!
        message: String!
    }
    input PostInput {
        title: String
        desc: String
    }

`