import {Router} from "express";
import {register,login,logout} from "../controllers/authControllers";

// middleware -check point  in your app flow they can chnage in both incoming and outgoing reponse and request






const router=Router();
