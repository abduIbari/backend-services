import {
  getAllTodos,
  createNewTodo,
  updateTodo,
  deleteTodo,
} from "../handlers/todoHandlers.js";
import Todo from "../db/models/Todos.js";
import { validationResult } from "express-validator";

// Mock dependencies
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

jest.mock("../db/models/Todos", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
}));

function mockReqRes(body: any = {}, params: any = {}, user_uuid?: string) {
  const req: any = { body, params, user_uuid };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  return { req, res };
}

describe("Todo Handlers", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getAllTodos", () => {
    it("returns 401 if user_uuid missing", async () => {
      const { req, res } = mockReqRes({}, {}, undefined);
      await getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied, invalid authentication code",
      });
    });

    it("returns todos successfully", async () => {
      const todosMock = [{ id: 1, content: "test" }];
      (Todo.findAll as jest.Mock).mockResolvedValue(todosMock);

      const { req, res } = mockReqRes({}, {}, "user-123");
      await getAllTodos(req, res);

      expect(Todo.findAll).toHaveBeenCalledWith({
        where: { user_uuid: "user-123" },
        order: [["createdAt", "DESC"]],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        todos: todosMock,
        message: "Successfully fetched all tasks",
      });
    });

    it("returns 500 on error", async () => {
      (Todo.findAll as jest.Mock).mockRejectedValue(new Error("DB error"));

      const { req, res } = mockReqRes({}, {}, "user-123");
      await getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("createNewTodo", () => {
    beforeEach(() => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
    });

    it("returns 400 if validation fails", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Validation error" }],
      });

      const { req, res } = mockReqRes();
      await createNewTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: "Validation error" }],
      });
    });

    it("returns 401 if user_uuid missing", async () => {
      const { req, res } = mockReqRes({ content: "task" }, {}, undefined);
      await createNewTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied, invalid authentication code",
      });
    });

    it("creates todo successfully", async () => {
      const newTodoMock = {
        uuid: "todo-123",
        content: "task",
        user_uuid: "user-123",
        createdAt: new Date(),
      };
      (Todo.create as jest.Mock).mockResolvedValue(newTodoMock);

      const { req, res } = mockReqRes({ content: "task" }, {}, "user-123");
      await createNewTodo(req, res);

      expect(Todo.create).toHaveBeenCalledWith({
        user_uuid: "user-123",
        content: "task",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Task successfully created",
        task: {
          task_uuid: newTodoMock.uuid,
          content: newTodoMock.content,
          user_uuid: newTodoMock.user_uuid,
          completed: false,
          createdAt: newTodoMock.createdAt,
        },
      });
    });

    it("returns 500 on error", async () => {
      (Todo.create as jest.Mock).mockRejectedValue(new Error("DB error"));

      const { req, res } = mockReqRes({ content: "task" }, {}, "user-123");
      await createNewTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("updateTodo", () => {
    beforeEach(() => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
    });

    it("returns 400 if validation fails", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Validation error" }],
      });

      const { req, res } = mockReqRes({}, { uuid: "todo-123" }, "user-123");
      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: "Validation error" }],
      });
    });

    it("returns 401 if user_uuid missing", async () => {
      const { req, res } = mockReqRes(
        { content: "updated" },
        { uuid: "todo-123" },
        undefined
      );
      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied, invalid authentication code",
      });
    });

    it("returns 404 if todo not found", async () => {
      (Todo.findOne as jest.Mock).mockResolvedValue(null);

      const { req, res } = mockReqRes(
        { content: "updated" },
        { uuid: "todo-123" },
        "user-123"
      );
      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("returns 400 if nothing to update", async () => {
      (Todo.findOne as jest.Mock).mockResolvedValue({
        update: jest.fn(),
      });

      const { req, res } = mockReqRes({}, { uuid: "todo-123" }, "user-123");
      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Nothing to update" });
    });

    it("updates todo successfully", async () => {
      const updateMock = jest.fn();
      const todoMock = {
        update: updateMock,
        uuid: "todo-123",
        content: "old",
        user_uuid: "user-123",
        completed: false,
      };
      (Todo.findOne as jest.Mock).mockResolvedValue(todoMock);

      const { req, res } = mockReqRes(
        { content: "updated", completed: true },
        { uuid: "todo-123" },
        "user-123"
      );
      await updateTodo(req, res);

      expect(updateMock).toHaveBeenCalledWith({
        content: "updated",
        completed: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Task successfully updated",
        updatedTask: todoMock,
      });
    });

    it("returns 500 on error", async () => {
      (Todo.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

      const { req, res } = mockReqRes(
        { content: "updated" },
        { uuid: "todo-123" },
        "user-123"
      );
      await updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("deleteTodo", () => {
    beforeEach(() => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
    });

    it("returns 400 if validation fails", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Validation error" }],
      });

      const { req, res } = mockReqRes({}, { uuid: "todo-123" }, "user-123");
      await deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: "Validation error" }],
      });
    });

    it("returns 401 if user_uuid missing", async () => {
      const { req, res } = mockReqRes({}, { uuid: "todo-123" }, undefined);
      await deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied, invalid authentication code",
      });
    });

    it("returns 404 if todo not found", async () => {
      (Todo.findOne as jest.Mock).mockResolvedValue(null);

      const { req, res } = mockReqRes({}, { uuid: "todo-123" }, "user-123");
      await deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("deletes todo successfully", async () => {
      const destroyMock = jest.fn().mockResolvedValue(undefined);
      const todoMock = { destroy: destroyMock };
      (Todo.findOne as jest.Mock).mockResolvedValue(todoMock);

      const { req, res } = mockReqRes({}, { uuid: "todo-123" }, "user-123");
      await deleteTodo(req, res);

      expect(destroyMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("returns 500 on error", async () => {
      (Todo.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

      const { req, res } = mockReqRes({}, { uuid: "todo-123" }, "user-123");
      await deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
