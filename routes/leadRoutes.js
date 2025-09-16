import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createLead,
  getAllLeads,
  getMyLeads,
  updateLeadStatus,
} from "../controllers/leadController.js";

const router = express.Router();

// User creates lead
router.post("/", createLead);

// Partner gets their property leads
router.get("/my", protect, getMyLeads);

// Admin routes
router.get("/", protect, adminOnly, getAllLeads);
router.put("/:id/status", protect, adminOnly, updateLeadStatus);

export default router;
