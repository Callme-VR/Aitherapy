import { auth } from "../middleware/auth";
import express from "express";
import { logActivity } from "../controllers/activityController";

const router = express.Router();

router.use(auth);
router.post("/", logActivity);
export default router;
