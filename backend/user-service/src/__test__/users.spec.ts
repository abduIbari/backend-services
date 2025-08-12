import { registerUser, loginUser } from "../handlers/userHandlers.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/models/Users.js";

// Mock dependencies
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../db/models/Users", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

function mockReqRes(body: any = {}) {
  const req: any = { body };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  return { req, res };
}

describe("registerUser", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid email or password" }],
    });

    const { req, res } = mockReqRes();
    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid email or password" }],
    });
  });

  it("returns 409 if user already exists", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

    const { req, res } = mockReqRes({
      user_email: "test@example.com",
      user_pwd: "password123",
    });
    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { user_email: "test@example.com" },
    });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });

  it("creates user and returns 201", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
    (User.create as jest.Mock).mockResolvedValue({
      uuid: "123",
      user_email: "test@example.com",
      createdAt: "2025-08-11",
    });

    const { req, res } = mockReqRes({
      user_email: "test@example.com",
      user_pwd: "password123",
    });
    await registerUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(User.create).toHaveBeenCalledWith({
      user_email: "test@example.com",
      user_pwd: "hashedpassword",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      user: {
        uuid: "123",
        email: "test@example.com",
        createdAt: "2025-08-11",
      },
    });
  });

  it("returns 500 on internal error", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (User.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

    const { req, res } = mockReqRes({
      user_email: "test@example.com",
      user_pwd: "password123",
    });
    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});

describe("loginUser", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid email or password" }],
    });

    const { req, res } = mockReqRes();
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid email or password" }],
    });
  });

  it("returns 404 if user does not exist", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const { req, res } = mockReqRes({
      user_email: "notfound@example.com",
      user_pwd: "password123",
    });
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
  });

  it("returns 401 if password is invalid", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (User.findOne as jest.Mock).mockResolvedValue({
      user_pwd: "hashedpassword",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const { req, res } = mockReqRes({
      user_email: "test@example.com",
      user_pwd: "wrongpassword",
    });
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: "Invalid password" });
  });

  it("returns 200 and JWT if valid credentials", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (User.findOne as jest.Mock).mockResolvedValue({
      uuid: "123",
      user_pwd: "hashedpassword",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mocktoken");

    const { req, res } = mockReqRes({
      user_email: "test@example.com",
      user_pwd: "password123",
    });
    await loginUser(req, res);

    expect(jwt.sign).toHaveBeenCalledWith({ user_uuid: "123" }, "jwt_secret", {
      expiresIn: "24h",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Logged in Successfully",
      token: "mocktoken",
    });
  });

  it("returns 500 on internal error", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    (User.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

    const { req, res } = mockReqRes({
      user_email: "test@example.com",
      user_pwd: "password123",
    });
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
