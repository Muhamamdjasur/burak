import { AUTH_TIMER } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";

class AuthService {
    private readonly secretToken: string;

    constructor() {
        this.secretToken = process.env.SECRET_TOKEN as string;
    }

    public createToken(payload: Member): Promise<string> {
        return new Promise((resolve, reject) => {
            const duration = `${AUTH_TIMER}h`;
            jwt.sign(
                payload,
                this.secretToken,
                { expiresIn: duration },
                (err, token) => {
                    if (err || !token)
                        reject(
                            new Errors(
                                HttpCode.UNAUTHORIZED,
                                Message.TOKEN_CREATION_FAILED
                            )
                        );
                    else resolve(token as string);
                }
            );
        });
    }

    public async checkAuth(token: string): Promise<Member> {
        // Token yo'q, bo'sh, "j:null" yoki "null"/"undefined" bo'lsa
        if (
            !token ||
            typeof token !== "string" ||
            token.startsWith("j:") ||
            token === "null" ||
            token === "undefined"
        ) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
        }

        try {
            const result = jwt.verify(token, this.secretToken) as Member;
            console.log(`---- [AUTH] memberNick: ${result.memberNick} ---`);
            return result;
        } catch (err) {
            // malformed, expired, invalid signature va h.k.
            throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
        }
    }
}

export default AuthService;