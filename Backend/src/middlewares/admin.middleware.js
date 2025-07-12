import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
  try {
    console.log("\n******** Inside verifyAdmin Function ********");
    
    if (!req.user) {
      throw new ApiError(401, "Please Login");
    }

    if (req.user.role !== 'admin') {
      throw new ApiError(403, "Admin access required. You don't have permission to access this resource.");
    }

    console.log("Admin access verified for user:", req.user.username);
    next();
  } catch (error) {
    console.log("Error in verifyAdmin Middleware:", error);
    throw new ApiError(403, error.message || "Admin access denied");
  }
});

export { verifyAdmin }; 