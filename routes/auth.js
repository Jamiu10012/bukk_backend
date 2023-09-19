import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

// CREATE A USER
router.post("/signup", register);
// SIGN IN
router.post("/signin", login);

export default router;
