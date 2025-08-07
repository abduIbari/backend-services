import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/models/Users.js";

export async function registerUser(
  request: Request,
  response: Response
): Promise<void> {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    response.status(400).json({ errors: result.array() });
    return;
  }

  const { user_email, user_pwd } = request.body;

  try {
    const existingUser = await User.findOne({ where: { user_email } });
    if (existingUser) {
      response.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(user_pwd, 10);

    const newUser = await User.create({
      user_email,
      user_pwd: hashedPassword,
    });

    response.status(201).json({
      message: "User registered successfully",
      user: {
        uuid: newUser.uuid,
        email: newUser.user_email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(
  request: Request,
  response: Response
): Promise<void> {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    response.status(400).json({ errors: result.array() });
    return;
  }

  const { user_email, user_pwd } = request.body;

  try {
    const existingUser = await User.findOne({ where: { user_email } });
    if (!existingUser) {
      response.status(404).json({ message: "User does not exist" });
      return;
    }

    const passwordIsValid = await bcrypt.compare(
      user_pwd,
      existingUser.user_pwd
    );
    if (!passwordIsValid) {
      response.status(401).send({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      { uuid: existingUser.uuid, user_email: existingUser.user_email },
      "jwt_secret",
      {
        expiresIn: "24h",
      }
    );
    response.status(200).json({ message: "Logged in Successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}
