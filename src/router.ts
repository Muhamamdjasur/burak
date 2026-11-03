import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
/** Member */
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post(
    "/member/logout", 
    memberController.verifyAuth, 
    memberController.logout
);
router.get(
    "/member/detail", 
    memberController.verifyAuth, 
    memberController.getMemberDetail);

    router.post(
        "/member/update", 
        memberController.verifyAuth, 
        uploader("member").single("memberImage"),
        memberController.updateMember
    );

    router.get(
        "/member/top-users", 
        memberController.getTopUsers
    );

/** Product */

/** Order */

// router.get("/", memberController.goHome);

// router.get("/login", memberController.getLogin);

// router.get("/signup", memberController.getSignup);

export default router;