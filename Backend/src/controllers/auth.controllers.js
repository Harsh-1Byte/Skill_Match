import { generateJWTToken_email, generateJWTToken_username } from "../utils/generateJWTToken.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

export const googleAuthHandler = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "http://localhost:5173/login",
  session: false,
});

export const handleGoogleLoginCallback = asyncHandler(async (req, res) => {
  console.log("\n******** Inside handleGoogleLoginCallback function ********");
  console.log("User Google Info:", req.user._json);

  const existingUser = await User.findOne({ email: req.user._json.email });
  console.log("Existing user found:", existingUser ? "Yes" : "No");

  if (existingUser) {
    console.log("User exists, generating JWT token and redirecting to home");
    const jwtToken = generateJWTToken_username(existingUser);
    const expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
    res.cookie("accessToken", jwtToken, { 
      httpOnly: true, 
      expires: expiryDate, 
      secure: false,
      sameSite: 'lax',
      path: '/'
    });
    console.log("Cookie set, redirecting to home page");
    return res.redirect(`http://localhost:5173/`);
  }

  console.log("User doesn't exist, checking for unregistered user");
  let unregisteredUser = await UnRegisteredUser.findOne({ email: req.user._json.email });
  if (!unregisteredUser) {
    console.log("Creating new Unregistered User");
    unregisteredUser = await UnRegisteredUser.create({
      name: req.user._json.name,
      email: req.user._json.email,
      picture: req.user._json.picture,
    });
  }
  console.log("Unregistered user found/created, generating JWT token and redirecting to register");
  const jwtToken = generateJWTToken_email(unregisteredUser);
  const expiryDate = new Date(Date.now() + 0.5 * 60 * 60 * 1000);
  res.cookie("accessTokenRegistration", jwtToken, { 
    httpOnly: true, 
    expires: expiryDate, 
    secure: false,
    sameSite: 'lax',
    path: '/'
  });
  console.log("Registration cookie set, redirecting to register page");
  return res.redirect("http://localhost:5173/register");
});

export const handleLogout = (req, res) => {
  console.log("\n******** Inside handleLogout function ********");
  res.clearCookie("accessToken");
  res.clearCookie("accessTokenRegistration");
  return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
};

export const checkAuth = asyncHandler(async (req, res) => {
  console.log("\n******** Inside checkAuth function ********");
  
  // Check for both types of tokens
  const accessToken = req.cookies?.accessToken;
  const accessTokenRegistration = req.cookies?.accessTokenRegistration;
  
  console.log("Access Token:", accessToken ? "Present" : "Not present");
  console.log("Access Token Registration:", accessTokenRegistration ? "Present" : "Not present");
  
  if (!accessToken && !accessTokenRegistration) {
    console.log("No tokens found, user not authenticated");
    return res.status(200).json(new ApiResponse(200, { authenticated: false }, "Not authenticated"));
  }
  
  try {
    // Try to verify the access token first (for registered users)
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      console.log("Access token verified successfully for user:", decoded.username);
      return res.status(200).json(new ApiResponse(200, { authenticated: true, userType: "registered" }, "User is authenticated"));
    }
    
    // Try to verify the registration token (for unregistered users)
    if (accessTokenRegistration) {
      const decoded = jwt.verify(accessTokenRegistration, process.env.JWT_SECRET);
      console.log("Registration token verified successfully for email:", decoded.email);
      return res.status(200).json(new ApiResponse(200, { authenticated: true, userType: "unregistered" }, "User is authenticated"));
    }
  } catch (error) {
    console.log("Token verification failed:", error.message);
    // Clear invalid cookies
    res.clearCookie("accessToken");
    res.clearCookie("accessTokenRegistration");
    return res.status(200).json(new ApiResponse(200, { authenticated: false }, "Invalid token"));
  }
  
  return res.status(200).json(new ApiResponse(200, { authenticated: false }, "Not authenticated"));
});

export const testEndpoint = asyncHandler(async (req, res) => {
  console.log("\n******** Inside testEndpoint function ********");
  return res.status(200).json(new ApiResponse(200, { message: "Backend is working!" }, "Test successful"));
});

export const debugCookies = asyncHandler(async (req, res) => {
  console.log("\n******** Inside debugCookies function ********");
  console.log("All cookies:", req.cookies);
  console.log("Access Token:", req.cookies?.accessToken);
  console.log("Access Token Registration:", req.cookies?.accessTokenRegistration);
  
  return res.status(200).json(new ApiResponse(200, {
    allCookies: req.cookies,
    accessToken: req.cookies?.accessToken ? "Present" : "Not present",
    accessTokenRegistration: req.cookies?.accessTokenRegistration ? "Present" : "Not present"
  }, "Cookie debug info"));
});
