import type { UUID } from "crypto";
import * as express from "express";

export interface RequestWithUserUuid extends express.Request {
  user_uuid?: UUID;
}
