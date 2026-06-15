import express from "express";
import { register,login,update,deleteClient,forgetPassword,otpVerification, getAllUsers } from "../controller/auth.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/update", verifyToken, update);
router.delete("/delete", verifyToken, authorizeRoles('admin'), deleteClient);
router.use("/forget-password", forgetPassword);
router.use("/otp-verification", otpVerification);
router.get("/users", verifyToken, authorizeRoles('admin'), getAllUsers);


export default router;