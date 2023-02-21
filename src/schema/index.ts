// import { gql } from "apollo-server"
// export const typeDefs =  gql`
export const typeDefs = `#graphql
    type Query{
        posts: [Post!]
        me: Users!
        profile(UserID: ID!): Profile
    }
    type Mutation {
        postCreate(post: PostInput!): postPayload
        postUpdate(postID: ID!,post: PostInput!): postPayload
        postDelete(postID: ID!): postPayload
        signup(email: String!, name:String!, password: String!, bio: String!): signupPayLoad!
        signin(email:String!, password:String!):signupPayLoad!
        postPublish(postID: ID!):postPayload
        postUnpublish(postID: ID!):postPayload
        verifyToken(token:String): verifyTokenPayLoad!
    }
    type Post{
        id: ID!
        title: String!
        desc: String
        createAt: String!
        isPublished: Boolean!
        users: Users!
    }
    type Users{
        id: ID!
        name: String!
        email: String!
        createAt: String!
        posts: [Post!]
        Profile: [Profile!]
    }
    type Profile{
        id: ID!
        bio: String!
        createAt: String!
        isMyProfile: Boolean!
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