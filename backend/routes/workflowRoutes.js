import { Router } from "express";
import { createWorkflow, getWorkflow, listWorkflows } from "../controllers/workflowController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listWorkflows);
router.post("/", createWorkflow);
router.get("/:id", getWorkflow);

export default router;
