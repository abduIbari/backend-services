import express, { type Request, type Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());

app.use(express.json());

// Routes
app.use("/user", userRoutes);

export default app;
