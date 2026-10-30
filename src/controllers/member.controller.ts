import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode } from "../libs/Errors";
import AuthService from "../models/Auth.service";
import { token } from "morgan";
import { AUTH_TIMER } from "../libs/config";

const memberService = new MemberService();
const authService = new AuthService();


const memberController: T = {};
memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup");
        console.log("body:", req.body);
        const input: MemberInput = req.body,
            result: Member = await memberService.signup(input);
            const token = await authService.createToken(result);
              res.cookie("accessToken", token, {
                maxAge: AUTH_TIMER * 3600 * 1000,
                httpOnly: false,
            })
            
            res.status( HttpCode.CREATED).json({ member: result, accessToken: token });
    } catch (err) {
        console.log("Error, signup:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard.message);
    }
};

memberController.login = async (req: Request, res: Response) => {
    try {
        console.log("login");
        const input: LoginInput = req.body,
            result = await memberService.login(input),
            token = await authService.createToken(result);
           
            res.cookie("accessToken", token, {
                maxAge: AUTH_TIMER * 3600 * 1000,
                httpOnly: false,
            })
            
            res.status( HttpCode.OK).json({ member: result, accessToken: token });
    } catch (err) {
        console.log("Error, login:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard.message);
    }
};

// REACT

// memberController.goHome = (req: Request, res: Response) => {
//     try {
//         res.render("home");
//     } catch (err) {
//         console.log("Error, goHome:", err);
//     }
// };

// memberController.getLogin = (req: Request, res: Response) => {
//     try {
//         res.render("login");
//     } catch (err) {
//         console.log("Error, getLogin:", err);
//     }
// };

// memberController.getSignup = (req: Request, res: Response) => {
//     try {
//         res.render("signup");
//     } catch (err) {
//         console.log("Error, getSignup:", err);
//     }
// };

export default memberController;