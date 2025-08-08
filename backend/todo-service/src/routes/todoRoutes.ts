import express from "express";
import { body, param } from "express-validator";
import {
  getAllTodos,
  createNewTodo,
  updateTodo,
  deleteTodo,
} from "../handlers/todoHandlers.js";
const router = express.Router();

router.get("/", getAllTodos);

router.post(
  "/",
  body("content").exists().notEmpty().isString().trim(),
  createNewTodo
);

router.put(
  "/:uuid",
  param("uuid").isUUID(),
  body("content").optional().isString().notEmpty(),
  body("completed").optional().isBoolean(),
  updateTodo
);

router.delete("/:uuid", param("uuid").isUUID(), deleteTodo);

export default router;
