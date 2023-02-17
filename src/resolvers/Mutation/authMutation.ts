import { Context } from "../../index"
import validator from "validator";
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken";

interface signinArgs {
    email: string
    password: string
}
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
            const userID = BigInt(user.id).toString();
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
                        userID,
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
        
    },
    signin: async (_:any, args: signinArgs, { prisma }: Context): Promise<signupPayload> => {

        const { email, password } = args;
        if (!email || !password) {
            return {
                userErrors: [{
                    message: "Need to Provide Email and Password to sign in"
                }],
                token: null
            }
        }
        const user = await prisma.users.findUnique({
            where: {
                email
            },
            select: {
                email: true,
                password: true,
                id: true
            }
        });
        if (!user) {
            return {
                userErrors: [{
                    message: "Invalid Credentials"
                }],
                token: null
            }
        }
        const passwordMatched = await bcrypt.compare(password, user.password);
        
        if (!passwordMatched) {
            return {
                userErrors: [{
                    message: "Invalid Credentials2"
                }],
                token: null
            }
        }
        const userID = BigInt(user.id).toString();
        const jwtSalt = process.env.jwtSalt;
        
        return {
            userErrors: [{
                message: ""
            }],
            token: Jwt.sign(
                {
                    userID,
                },
                jwtSalt as string,
                {
                    expiresIn: (60*60*24*2) // 2 days sec*min*hrs*days
                }
            )
        }
    }
}