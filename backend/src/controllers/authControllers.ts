import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import process from "process";
import { Session } from "../models/Session";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || password) {
      return res.status(400).json({ message: "all filed are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "email is already verified by this account" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "User registered SuccessFully.",
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", err: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "email and password are reuired" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "invalid email",
      });
    }
    const Ispassword = await bcrypt.compare(password, user.password);
    if (!Ispassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    const session = new Session({
      userId: user._id,
      token,
      expiresAt,
      deviceInfo: req.headers["user-agent"],
    });
    await session.save();
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      message: "Login SuccessFully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      await Session.deleteOne({ token });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


