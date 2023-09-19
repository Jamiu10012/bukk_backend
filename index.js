import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import resumeAuthRoutes from "./routes/resumeauth.js";
import connection from "./db.js";
const app = express();

const port = process.env.PORT || 8000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(port, () => console.log(`Runnin on port ${port}`));

app.use("/api/auth", authRoutes);
app.use("/api/resumeauth", resumeAuthRoutes);

connection;
