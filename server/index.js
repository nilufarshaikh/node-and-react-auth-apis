import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();
import { UserRouter } from "./routes/user.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  "mongodb+srv://nilufar:Loveislife27@cluster0.l9dl2bf.mongodb.net/authentication?retryWrites=true&w=majority&appName=Cluster0"
);

const db = mongoose.connection;
db.on("error", (error) => console.error("Error " + error));
db.once("open", () => console.log("Connected to MongoDB"));

app.use("/auth", UserRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running...");
});
