import express from "express";
import { body, validationResult } from "express-validator";
import { loginUser, registerUser } from "../handlers/userHandlers.js";

const router = express.Router();

router.post(
  "/register",
  body("user_email").notEmpty().isEmail().normalizeEmail().trim(),
  body("user_pwd")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must have atleast 6 characters"),
  registerUser
);

router.post(
  "/login",
  body("user_email").notEmpty().isEmail().normalizeEmail(),
  body("user_pwd").notEmpty(),
  loginUser
);

export default router;
