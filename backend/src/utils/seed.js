import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();
await Promise.all([User.deleteMany(), Project.deleteMany()]);

const admin = await User.create({
  name: "Admin User",
  email: "admin@example.com",
  password: "password123",
  role: "admin",
  department: "Operations"
});

const user = await User.create({
  name: "Project Member",
  email: "user@example.com",
  password: "password123",
  role: "user",
  department: "Engineering"
});

await Project.create({
  title: "Client Portal Build",
  description: "Ship authentication, project tracking, and file upload workflows.",
  startDate: new Date(),
  endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  status: "In-Progress",
  assignedUsers: [user._id],
  createdBy: admin._id
});

console.log("Seeded admin@example.com and user@example.com with password password123");
process.exit(0);
