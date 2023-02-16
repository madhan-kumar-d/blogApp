import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
// import { JSON_SIGNATURE } from "../../keys";
const JSON_SIGNATURE = "123123123";

interface SignupArgs {
    email: string;
    password: string;
  name: string;
  bio: string;
}

interface SigninArgs {
  credentials: {
    email: string;
    password: string;
  };
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authMutation = {
  signup: async (
    _: any,
    { email, password, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {

    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "Invalid email",
          },
        ],
        token: null,
      };
    }

    const isValidPassword = validator.isLength(password, {
      min: 5,
    });

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "Invalid password",
          },
        ],
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "Invalid name or bio",
          },
        ],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        user_id: user.id,
      },
    });

    return {
      userErrors: [],
      token: JWT.sign(
        {
          userId: user.id,
        },
        JSON_SIGNATURE,
        {
          expiresIn: 3600000,
        }
      ),
    };
  },
};