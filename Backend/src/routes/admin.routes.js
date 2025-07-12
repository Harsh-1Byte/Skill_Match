import { Router } from "express";
import { verifyJWT_username } from "../middlewares/verifyJWT.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  toggleUserBan,
  getAllReports,
  updateReportStatus,
  getDashboardAnalytics,
  getAnalytics,
  getSettings,
  updateSettings,
  resetSettings,
  createBackup
} from "../controllers/admin.controllers.js";

const router = Router();

// Apply admin middleware to all routes
router.use(verifyJWT_username, verifyAdmin);

// Dashboard analytics
router.route("/dashboard").get(getDashboardAnalytics);

// Comprehensive analytics
router.route("/analytics").get(getAnalytics);

// Settings management routes
router.route("/settings").get(getSettings);
router.route("/settings").put(updateSettings);
router.route("/settings/reset").post(resetSettings);
router.route("/backup").post(createBackup);

// User management routes
router.route("/users").get(getAllUsers);
router.route("/users/:userId").get(getUserById);
router.route("/users/:userId/role").patch(updateUserRole);
router.route("/users/:userId").delete(deleteUser);
router.route("/users/:userId/ban").patch(toggleUserBan);

// Report management routes
router.route("/reports").get(getAllReports);
router.route("/reports/:reportId/status").patch(updateReportStatus);

export default router; 