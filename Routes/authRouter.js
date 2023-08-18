import express from "express";
import authController from "./../Controllers/authController.js";
import object from "./../Controllers/authController.js";
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgotPassword").post(object.forgotPassword);
router.route("/resetPassword/:token").patch(object.resetPassword);
export default router;
