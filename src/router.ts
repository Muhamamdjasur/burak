import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
/** Member */
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.get("/member/detail", memberController.verifyAuth);

/** Product */

/** Order */

// router.get("/", memberController.goHome);

// router.get("/login", memberController.getLogin);

// router.get("/signup", memberController.getSignup);

export default router;