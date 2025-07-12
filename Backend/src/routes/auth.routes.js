import { Router } from "express";
import {
  googleAuthCallback,
  googleAuthHandler,
  handleGoogleLoginCallback,
  handleLogout,
  checkAuth,
  testEndpoint,
  debugCookies,
} from "../controllers/auth.controllers.js";

const router = Router();

router.get("/google", googleAuthHandler);
router.get("/google/callback", googleAuthCallback, handleGoogleLoginCallback);
router.get("/logout", handleLogout);
router.get("/check", checkAuth);
router.get("/test", testEndpoint);
router.get("/debug", debugCookies);

export default router;
