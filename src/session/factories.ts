import { sign } from "jsonwebtoken";

export class TokenFactory {

    static create = (userId: number) => {
        const token = sign({}, process.env.JWT_SECRET as string, {
            subject: userId.toString(),
            expiresIn: process.env.JWT_EXPIRES_IN as string,
          });
      

        return token;
    };
}