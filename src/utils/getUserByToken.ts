import JWT from "jsonwebtoken";

export const GetUserByToken = async (token: string) => {
    try {
        const salt = process.env.jwtSalt as string;
        const signature = await JWT.verify(token, salt) as {
            userID: number;
        };
        
        return signature;
    }
    catch (e: any) {
        return null;
    }
}