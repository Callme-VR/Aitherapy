import express, { Router } from "express";
import { auth } from "../middleware/auth";
import { createMood } from "../controllers/moodController";

const router = Router();

router.use(auth);

router.post("/", createMood);
export default router;
