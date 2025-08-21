import { Router, Request, Response } from "express";
import { register, login, logout } from "../controllers/authControllers";
import { auth } from "../middleware/auth";

// middleware -check point  in your app flow they can chnage in both incoming and outgoing reponse and request

const router = Router();


router.post("/register",register);
router.post("/login",login);
router.post("/logout",auth,logout);

router.get("/me",auth, async (req: Request, res: Response) => {
    res.json({ user: req.user });
})
export default router;