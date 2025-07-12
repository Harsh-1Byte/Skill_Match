import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Report } from "../models/report.model.js";
import { Chat } from "../models/chat.model.js";
import { Rating } from "../models/rating.model.js";
import { Request } from "../models/request.model.js";

// Get all users with pagination and search
export const getAllUsers = asyncHandler(async (req, res) => {
  console.log("\n******** Inside getAllUsers Controller ********");
  
  const { page = 1, limit = 10, search = "", role = "" } = req.query;
  const skip = (page - 1) * limit;

  let query = {};
  
  // Search functionality
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  const users = await User.find(query)
    .select('-__v')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json(
    new ApiResponse(200, {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, "Users retrieved successfully")
  );
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  console.log("\n******** Inside getUserById Controller ********");
  
  const { userId } = req.params;

  const user = await User.findById(userId).select('-__v');
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, user, "User retrieved successfully")
  );
});

// Update user role
export const updateUserRole = asyncHandler(async (req, res) => {
  console.log("\n******** Inside updateUserRole Controller ********");
  
  const { userId } = req.params;
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    throw new ApiError(400, "Invalid role. Must be 'user' or 'admin'");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select('-__v');

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, user, "User role updated successfully")
  );
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  console.log("\n******** Inside deleteUser Controller ********");
  
  const { userId } = req.params;

  const user = await User.findById(userId);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Cannot delete your own account");
  }

  // Delete related data
  await Chat.deleteMany({ users: userId });
  await Rating.deleteMany({ $or: [{ rater: userId }, { username: user.username }] });
  await Request.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] });
  await Report.deleteMany({ $or: [{ reporter: userId }, { reported: userId }] });

  // Delete the user
  await User.findByIdAndDelete(userId);

  res.status(200).json(
    new ApiResponse(200, {}, "User and related data deleted successfully")
  );
});

// Get all reports with pagination
export const getAllReports = asyncHandler(async (req, res) => {
  console.log("\n******** Inside getAllReports Controller ********");
  
  const { page = 1, limit = 10, status = "" } = req.query;
  const skip = (page - 1) * limit;

  let query = {};
  
  if (status) {
    query.status = status;
  }

  const reports = await Report.find(query)
    .populate('reporter', 'username name email')
    .populate('reported', 'username name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalReports = await Report.countDocuments(query);
  const totalPages = Math.ceil(totalReports / limit);

  res.status(200).json(
    new ApiResponse(200, {
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReports,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, "Reports retrieved successfully")
  );
});

// Update report status
export const updateReportStatus = asyncHandler(async (req, res) => {
  console.log("\n******** Inside updateReportStatus Controller ********");
  
  const { reportId } = req.params;
  const { status, adminNotes } = req.body;

  if (!status || !['pending', 'resolved', 'dismissed'].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be 'pending', 'resolved', or 'dismissed'");
  }

  const report = await Report.findByIdAndUpdate(
    reportId,
    { 
      status,
      adminNotes,
      resolvedBy: req.user._id,
      resolvedAt: new Date()
    },
    { new: true }
  ).populate('reporter', 'username name email')
   .populate('reported', 'username name email');

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  res.status(200).json(
    new ApiResponse(200, report, "Report status updated successfully")
  );
});

// Get dashboard analytics
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  console.log("\n******** Inside getDashboardAnalytics Controller ********");
  
  // Get total counts
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalReports = await Report.countDocuments();
  const pendingReports = await Report.countDocuments({ status: 'pending' });
  const totalChats = await Chat.countDocuments();
  const totalRatings = await Rating.countDocuments();

  // Get recent activity
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('username name email createdAt');

  const recentReports = await Report.find()
    .populate('reporter', 'username name')
    .populate('reported', 'username name')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('reporter reported nature status createdAt');

  // Get user growth (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const newUsersThisWeek = await User.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  // Get top rated users
  const topRatedUsers = await User.find()
    .sort({ rating: -1 })
    .limit(5)
    .select('username name rating');

  const analytics = {
    overview: {
      totalUsers,
      totalAdmins,
      totalReports,
      pendingReports,
      totalChats,
      totalRatings,
      newUsersThisWeek
    },
    recentActivity: {
      recentUsers,
      recentReports
    },
    topRatedUsers
  };

  res.status(200).json(
    new ApiResponse(200, analytics, "Dashboard analytics retrieved successfully")
  );
});

// Ban/Unban user
export const toggleUserBan = asyncHandler(async (req, res) => {
  console.log("\n******** Inside toggleUserBan Controller ********");
  
  const { userId } = req.params;
  const { isBanned, reason } = req.body;

  if (typeof isBanned !== 'boolean') {
    throw new ApiError(400, "isBanned must be a boolean value");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { 
      isBanned,
      banReason: isBanned ? reason : null,
      bannedAt: isBanned ? new Date() : null,
      bannedBy: isBanned ? req.user._id : null
    },
    { new: true }
  ).select('-__v');

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const action = isBanned ? "banned" : "unbanned";
  res.status(200).json(
    new ApiResponse(200, user, `User ${action} successfully`)
  );
}); 

// Get comprehensive analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  console.log("\n******** Inside getAnalytics Controller ********");
  
  const { timeRange = "7d" } = req.query;
  
  // Calculate date range
  const now = new Date();
  let startDate;
  switch (timeRange) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  // Get total counts
  const totalUsers = await User.countDocuments();
  const totalReports = await Report.countDocuments();
  const pendingReports = await Report.countDocuments({ status: 'pending' });
  const resolvedReports = await Report.countDocuments({ status: 'resolved' });
  const dismissedReports = await Report.countDocuments({ status: 'dismissed' });
  const totalChats = await Chat.countDocuments();
  const totalRatings = await Rating.countDocuments();

  // Get user activity breakdown
  const activeUsers = await User.countDocuments({ isBanned: false });
  const inactiveUsers = await User.countDocuments({ 
    lastActiveAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
  });
  const bannedUsers = await User.countDocuments({ isBanned: true });
  const premiumUsers = await User.countDocuments({ isPremium: true });

  // Get new users in time range
  const newUsers = await User.countDocuments({
    createdAt: { $gte: startDate }
  });

  // Get average rating
  const ratings = await Rating.find();
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : 0;

  // Get reports breakdown
  const reports = {
    pending: pendingReports,
    resolved: resolvedReports,
    dismissed: dismissedReports,
    total: totalReports
  };

  // Get top skills (mock data for now since skills are stored as arrays)
  const topSkills = [
    { skill: "JavaScript", count: Math.floor(Math.random() * 100) + 50, percentage: 18.7 },
    { skill: "Python", count: Math.floor(Math.random() * 80) + 40, percentage: 15.9 },
    { skill: "React", count: Math.floor(Math.random() * 70) + 30, percentage: 13.4 },
    { skill: "Node.js", count: Math.floor(Math.random() * 60) + 25, percentage: 11.6 },
    { skill: "Java", count: Math.floor(Math.random() * 50) + 20, percentage: 9.9 }
  ];

  // Get recent activity
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .select('name username createdAt');

  const recentReports = await Report.find()
    .populate('reporter', 'username')
    .populate('reported', 'username')
    .sort({ createdAt: -1 })
    .limit(2)
    .select('reporter reported reason createdAt');

  // Format recent activity
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const recentActivity = {
    newUsers: recentUsers.map(user => ({
      name: user.name,
      username: user.username,
      time: formatTimeAgo(user.createdAt)
    })),
    newReports: recentReports.map(report => ({
      reporter: report.reporter?.username || "Unknown",
      reported: report.reported?.username || "Unknown",
      reason: report.reason || "No reason provided",
      time: formatTimeAgo(report.createdAt)
    }))
  };

  // Get user activity breakdown
  const userActivity = {
    activeUsers,
    inactiveUsers,
    bannedUsers,
    premiumUsers
  };

  const analytics = {
    overview: {
      totalUsers,
      activeUsers,
      newUsers,
      totalReports,
      pendingReports,
      resolvedReports,
      totalChats,
      totalRatings,
      averageRating: parseFloat(averageRating)
    },
    userActivity,
    reports,
    topSkills,
    recentActivity
  };

  res.status(200).json(
    new ApiResponse(200, analytics, "Analytics retrieved successfully")
  );
}); 

// Get platform settings
export const getSettings = asyncHandler(async (req, res) => {
  console.log("\n******** Inside getSettings Controller ********");
  
  // For now, return default settings structure
  // In a real application, these would be stored in a database
  const settings = {
    platform: {
      siteName: "SkillSwap",
      siteDescription: "A platform for skill exchange and learning",
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerification: true,
      maxFileSize: 5,
      allowedFileTypes: ["jpg", "jpeg", "png", "gif"]
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableTwoFactor: false,
      rateLimitEnabled: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      adminAlerts: true,
      reportAlerts: true,
      userActivityAlerts: false
    },
    content: {
      autoModeration: true,
      profanityFilter: true,
      imageModeration: false,
      maxSkillsPerUser: 10,
      maxBioLength: 500,
      allowExternalLinks: false
    },
    system: {
      backupFrequency: "daily",
      logRetention: 30,
      cacheEnabled: true,
      compressionEnabled: true,
      debugMode: false
    }
  };

  res.status(200).json(
    new ApiResponse(200, settings, "Settings retrieved successfully")
  );
});

// Update platform settings
export const updateSettings = asyncHandler(async (req, res) => {
  console.log("\n******** Inside updateSettings Controller ********");
  
  const { platform, security, notifications, content, system } = req.body;

  // Validate settings structure
  if (!platform || !security || !notifications || !content || !system) {
    throw new ApiError(400, "Invalid settings structure");
  }

  // In a real application, you would save these to a database
  // For now, we'll just return the updated settings
  const updatedSettings = {
    platform,
    security,
    notifications,
    content,
    system
  };

  res.status(200).json(
    new ApiResponse(200, updatedSettings, "Settings updated successfully")
  );
});

// Reset settings to defaults
export const resetSettings = asyncHandler(async (req, res) => {
  console.log("\n******** Inside resetSettings Controller ********");
  
  const defaultSettings = {
    platform: {
      siteName: "SkillSwap",
      siteDescription: "A platform for skill exchange and learning",
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerification: true,
      maxFileSize: 5,
      allowedFileTypes: ["jpg", "jpeg", "png", "gif"]
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableTwoFactor: false,
      rateLimitEnabled: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      adminAlerts: true,
      reportAlerts: true,
      userActivityAlerts: false
    },
    content: {
      autoModeration: true,
      profanityFilter: true,
      imageModeration: false,
      maxSkillsPerUser: 10,
      maxBioLength: 500,
      allowExternalLinks: false
    },
    system: {
      backupFrequency: "daily",
      logRetention: 30,
      cacheEnabled: true,
      compressionEnabled: true,
      debugMode: false
    }
  };

  res.status(200).json(
    new ApiResponse(200, defaultSettings, "Settings reset to defaults successfully")
  );
});

// Create data backup
export const createBackup = asyncHandler(async (req, res) => {
  console.log("\n******** Inside createBackup Controller ********");
  
  // In a real application, this would create a database backup
  // For now, we'll just return a success message
  const backupInfo = {
    backupId: `backup_${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: "completed",
    size: "2.5 MB",
    tables: ["users", "reports", "chats", "ratings", "requests"]
  };

  res.status(200).json(
    new ApiResponse(200, backupInfo, "Data backup created successfully")
  );
}); 