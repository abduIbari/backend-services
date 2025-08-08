import express, { type Request, type Response } from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(authMiddleware);

app.use("/api/todo", authMiddleware, todoRoutes);

export default app;
