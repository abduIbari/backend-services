import express, { type Request, type Response } from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

// Routes
app.use("/user", userRoutes);

export default app;
