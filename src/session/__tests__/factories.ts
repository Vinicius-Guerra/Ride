import { sign } from "jsonwebtoken";
import { parsedEnv } from "../../@shared/configs";

export class TokenFactory {
  static create = (userId: number) => {
    const token = sign({}, parsedEnv.JWT_SECRET, {
      subject: userId.toString(),
      expiresIn: parsedEnv.JWT_EXPIRES_IN,
    });

    return token;
  };
}