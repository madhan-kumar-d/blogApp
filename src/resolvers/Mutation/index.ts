import { postMutation } from "./postMutation"
import {authMutation} from "./authMutation"

export const Mutation = {
    ...postMutation, 
    ...authMutation
}