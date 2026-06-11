import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

const authPayload = (user) => ({ user, token: signToken(user) });

export const signup = asyncHandler(async (req, res) => {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0 && req.body.role === "admin") {
    res.status(403);
    throw new Error("Only the initial account can self-register as admin");
  }

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: existingUsers === 0 ? "admin" : "user",
    phone: req.body.phone,
    department: req.body.department
  });

  res.status(201).json(authPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json(authPayload(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});
