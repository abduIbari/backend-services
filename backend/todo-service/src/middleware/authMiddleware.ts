import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UUID } from "crypto";
import type { RequestWithUserUuid } from "../types/express/index.js";

export function authMiddleware(
  request: RequestWithUserUuid,
  response: Response,
  next: NextFunction
) {
  const requestHeader = request.headers["authorization"];
  const token = requestHeader?.split(" ")[1];
  if (!token) {
    response.status(401).json({ message: "No authentication token provided" });
    return;
  }
  jwt.verify(token, "jwt_secret", (error, decoded) => {
    if (error) {
      response.status(401).json({ message: "Invalid authentication token" });
      return;
    }
    const { user_uuid } = decoded as { user_uuid: UUID };
    request.user_uuid = user_uuid;
    next();
  });
}
