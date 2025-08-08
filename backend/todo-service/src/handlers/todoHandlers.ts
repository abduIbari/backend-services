import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import Todo from "../db/models/Todos.js";
import type { RequestWithUserUuid } from "../types/express/index.js";

export async function getAllTodos(
  request: RequestWithUserUuid,
  response: Response
): Promise<void> {
  try {
    const user_uuid = request.user_uuid;
    if (!user_uuid) {
      response
        .status(401)
        .json({ message: "Access denied, invalid authentication code" });
      return;
    }
    const todos = await Todo.findAll({
      where: {
        user_uuid: user_uuid,
      },
      order: [["createdAt", "DESC"]],
    });
    response
      .status(200)
      .json({ todos, message: "Successfully fetched all tasks" });
  } catch (error) {
    console.error("Error getting tasks:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function createNewTodo(
  request: RequestWithUserUuid,
  response: Response
): Promise<void> {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    response.status(400).json({ errors: result.array() });
    return;
  }
  try {
    const { content } = request.body;
    const user_uuid = request.user_uuid;
    if (!user_uuid) {
      response
        .status(401)
        .json({ message: "Access denied, invalid authentication code" });
      return;
    }
    const newTodo = await Todo.create({
      user_uuid: user_uuid,
      content: content,
    });
    response.status(201).json({
      message: "Task successfully created",
      task: {
        task_uuid: newTodo.uuid,
        content: newTodo.content,
        user_uuid: newTodo.user_uuid,
        completed: false,
        createdAt: newTodo.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating new task:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTodo(
  request: RequestWithUserUuid,
  response: Response
): Promise<void> {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    response.status(400).json({ errors: result.array() });
    return;
  }
  try {
    const { uuid } = request.params;
    const { content, completed } = request.body;
    const user_uuid = request.user_uuid;
    if (!user_uuid) {
      response
        .status(401)
        .json({ message: "Access denied, invalid authentication code" });
      return;
    }

    const todo = await Todo.findOne({
      where: { uuid: uuid, user_uuid: user_uuid },
    });
    if (!todo) {
      response.status(404).json({ message: "Task not found" });
      return;
    }
    if (content === undefined && completed === undefined) {
      response.status(400).json({ message: "Nothing to update" });
      return;
    }
    const updateFields: any = {};
    if (content !== undefined) updateFields.content = content;
    if (completed !== undefined) updateFields.completed = completed;
    await todo.update(updateFields);

    response
      .status(200)
      .json({ message: "Task successfully updated", updatedTask: todo });
  } catch (error) {
    console.error("Error updating task:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTodo(
  request: RequestWithUserUuid,
  response: Response
): Promise<void> {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    response.status(400).json({ errors: result.array() });
    return;
  }
  try {
    const user_uuid = request.user_uuid;
    if (!user_uuid) {
      response
        .status(401)
        .json({ message: "Access denied, invalid authentication code" });
      return;
    }
    const { uuid } = request.params;
    const todo = await Todo.findOne({
      where: { uuid: uuid, user_uuid: user_uuid },
    });
    if (!todo) {
      response.status(404).json({ message: "Task not found" });
      return;
    }

    await todo?.destroy();
    response.status(204).send();
  } catch (error) {
    console.error("Error updating task:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}
