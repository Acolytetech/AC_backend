import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  addProperty,
  getApprovedProperties,
  getMyProperties,
  updatePropertyStatus, searchProperties,
  getPropertyById
} from "../controllers/propertyContoller.js";
import {upload} from "../config/cloudinary.js";

const router = express.Router();

// Public
router.get("/", getApprovedProperties);
router.get("/:id" , getPropertyById);

// Partner
router.post("/",  upload.array("images", 5), addProperty);
router.get("/my", protect, getMyProperties);

// Admin
router.put("/:id/status", protect, adminOnly, updatePropertyStatus);

// Search & filter (Public)
router.get("/search", searchProperties);

export default router;
