import { Context } from "..";

interface ProfileParentType{
    bio: string,
    user_id: number,
    id: string
}
export const Profile = {
    users: ({ user_id }: ProfileParentType, _: any, { prisma, userInfo }: Context) => {
        return prisma.users.findUnique({
            where: {
                id: user_id,
            }
        })
    }
}