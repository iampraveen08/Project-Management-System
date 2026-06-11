import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Project from "../models/Project.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || "user",
    phone: req.body.phone,
    department: req.body.department
  });

  res.status(201).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("+password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  user.role = req.body.role ?? user.role;
  user.phone = req.body.phone ?? user.phone;
  user.department = req.body.department ?? user.department;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json(updated);
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error("Admins cannot delete their own account");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await Project.updateMany({}, { $pull: { assignedUsers: user._id } });
  await user.deleteOne();
  res.json({ message: "User deleted" });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.department = req.body.department ?? user.department;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json(updated);
});
