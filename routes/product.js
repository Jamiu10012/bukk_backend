import express from "express";
import {
  createResumeInfo,
  getResumeByUserAndResumeId,
  updateResumeByUserAndResumeId,
} from "../controllers/resumeInfo.js";
import { createResumesummary } from "../controllers/summary.js";
import {
  createProduct,
  getAllProducts,
  getProductByUserAndProductId,
  updateProductByUserAndProductId,
} from "../controllers/product.js";

const router = express.Router();

// CREATE A USER
router.post("/:userId", createProduct);
router.post("/summary/:userId", createResumesummary);
router.put("/:userId/:productId", updateProductByUserAndProductId);
router.get("/get/:userId/:productId", getProductByUserAndProductId);
router.get("/products", getAllProducts);
// SIGN IN
// router.post("/signin", login);

export default router;
