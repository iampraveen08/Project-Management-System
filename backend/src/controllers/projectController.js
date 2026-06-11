import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";

const mapFiles = (files = []) =>
  files.map((file) => ({
    originalName: file.originalname,
    filename: file.filename,
    path: `/uploads/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size
  }));

const parseAssignedUsers = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return String(value)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }
};

export const listProjects = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = req.user.role === "admin" ? {} : { assignedUsers: req.user._id };

  if (status) filter.status = status;
  if (search) filter.title = { $regex: search, $options: "i" };

  const projects = await Project.find(filter)
    .populate("assignedUsers", "name email role")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json(projects);
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("assignedUsers", "name email role department")
    .populate("createdBy", "name email");

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isAssigned = project.assignedUsers.some((user) => user._id.equals(req.user._id));
  if (req.user.role !== "admin" && !isAssigned) {
    res.status(403);
    throw new Error("You are not assigned to this project");
  }

  res.json(project);
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    status: req.body.status || "Pending",
    assignedUsers: parseAssignedUsers(req.body.assignedUsers),
    attachments: mapFiles(req.files),
    createdBy: req.user._id
  });

  res.status(201).json(await project.populate("assignedUsers", "name email role"));
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  project.title = req.body.title ?? project.title;
  project.description = req.body.description ?? project.description;
  project.startDate = req.body.startDate ?? project.startDate;
  project.endDate = req.body.endDate ?? project.endDate;
  project.status = req.body.status ?? project.status;
  if (req.body.assignedUsers !== undefined) {
    project.assignedUsers = parseAssignedUsers(req.body.assignedUsers);
  }

  const incomingFiles = mapFiles(req.files);
  if (incomingFiles.length) {
    const total = project.attachments.length + incomingFiles.length;
    if (total > 3) {
      res.status(400);
      throw new Error("A project can have a maximum of 3 attachments");
    }
    project.attachments.push(...incomingFiles);
  }

  const updated = await project.save();
  res.json(await updated.populate("assignedUsers", "name email role"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await project.deleteOne();
  res.json({ message: "Project deleted" });
});

export const updateProjectStatus = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isAssigned = project.assignedUsers.some((id) => id.equals(req.user._id));
  if (req.user.role !== "admin" && !isAssigned) {
    res.status(403);
    throw new Error("You are not assigned to this project");
  }

  project.status = req.body.status;
  await project.save();
  res.json(await project.populate("assignedUsers", "name email role"));
});
