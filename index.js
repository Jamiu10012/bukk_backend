import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import resumeAuthRoutes from "./routes/resumeauth.js";
import resumeRoutes from "./routes/resume.js";
import productRoutes from "./routes/product.js";
import connection, { dbMiddleware } from "./db.js";
const app = express();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(dbMiddleware);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(port, () => console.log(`Runnin on port ${port}`));

app.use("/api/auth", authRoutes);
app.use("/api/resumeauth", resumeAuthRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/product", productRoutes);

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  // response.header('Access-Control-Allow-Credentials', true);

  next();
});

connection;
