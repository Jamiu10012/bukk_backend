import express from "express";
import {
  createResumeInfo,
  getResumeByUserAndResumeId,
  updateResumeByUserAndResumeId,
} from "../controllers/resumeInfo.js";
import { createResumesummary } from "../controllers/summary.js";
import { createExprience } from "../controllers/resumeExp.js";

const router = express.Router();

// CREATE A USER
router.post("/exprience/:userId/:resumeId", createExprience);
router.post("/summary/:userId", createResumesummary);
router.put("/info/:userId/:resumeId", updateResumeByUserAndResumeId);
router.get("/info/get/:userId/:resumeId", getResumeByUserAndResumeId);
// SIGN IN
// router.post("/signin", login);

export default router;
