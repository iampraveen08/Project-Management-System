import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const sevenDays = new Date();
  sevenDays.setDate(now.getDate() + 7);

  const scope = req.user.role === "admin" ? {} : { assignedUsers: req.user._id };
  const [totalUsers, totalProjects, statusCounts, endingSoon] = await Promise.all([
    req.user.role === "admin" ? User.countDocuments() : Promise.resolve(undefined),
    Project.countDocuments(scope),
    Project.aggregate([
      { $match: scope },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    Project.find({ ...scope, endDate: { $gte: now, $lte: sevenDays } })
      .populate("assignedUsers", "name email")
      .sort({ endDate: 1 })
      .limit(10)
  ]);

  res.json({
    totalUsers,
    totalProjects,
    statusCounts: {
      Pending: 0,
      "In-Progress": 0,
      Completed: 0,
      ...Object.fromEntries(statusCounts.map((item) => [item._id, item.count]))
    },
    endingSoon
  });
});
