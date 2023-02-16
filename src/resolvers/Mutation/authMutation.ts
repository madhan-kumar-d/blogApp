import { Context } from "../../index"
import validator from "validator";
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken";

interface signupArgs {
    name: string
    email: string
    password: string
    bio: string
}
interface signupPayload{
    userErrors: {
      message: string;
    }[];
    token: string | null;
  }
export const authMutation = {
    signup: async (_: any, args: signupArgs, { prisma }: Context): Promise<signupPayload> => {
        const { name, email, password, bio } = args;
        const errors = [];
        const jwtSalt = process.env.jwtSalt;
        if (validator.isEmpty(name)) {
            errors.push({
                message: "Please provide name",
            })
        }
        if (validator.isEmpty(email)) {
            errors.push({
                message: "Please provide Email",
            })
        } else if (!validator.isEmail(email)) {
            errors.push({
                message: "Please provide valid Email",
            })
        }
        if (!validator.isStrongPassword(password)) {
            errors.push({
                message: "Please provide Strong Password",
            })
        }
        if (validator.isEmpty(bio)) {
            errors.push({
                message: "Please provide bio",
            })
        }
        if (errors.length > 0) {
            return {
                userErrors: [
                    ...errors
                ],
                token: null,
            }
        }
        try {
            const hashedPassword = await bcrypt.hash(password,12);
            const user = await prisma.users.create({
                data: {
                    name, 
                    email, 
                    password: hashedPassword, 
                }
            })
            await prisma.profile.create({
                data: {
                    bio,
                    user_id: user.id
                }
            })
            
            return {
                userErrors: [],
                token: Jwt.sign(
                    {
                        userID: user.id,
                    },
                    jwtSalt as string,
                    {
                        expiresIn: 3600
                    }
                )
            }
        } catch (e: any) {
            return {
                userErrors: [{
                    message: e
                }],
                token: null
            }
        }
        
    }
}