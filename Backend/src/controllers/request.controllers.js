import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import { generateJWTToken_username } from "../utils/generateJWTToken.js";
import { Request } from "../models/request.model.js";
import { Chat } from "../models/chat.model.js";
import { sendMail } from "../utils/SendMail.js";

export const createRequest = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside createRequest Controller function ********");

  const { receiverID } = req.body;
  const senderID = req.user._id;

  console.log("Sender ID: ", senderID);
  console.log("Receiver ID: ", receiverID);

  // Check if request already exists
  const existingRequest = await Request.find({ sender: senderID, receiver: receiverID });

  if (existingRequest.length > 0) {
    throw new ApiError(400, "Request already exists");
  }

  // Get sender and receiver details for email
  const sender = await User.findById(senderID);
  const receiver = await User.findById(receiverID);

  if (!sender || !receiver) {
    throw new ApiError(404, "User not found");
  }

  // Create the request
  const newRequest = await Request.create({
    sender: senderID,
    receiver: receiverID,
  });

  if (!newRequest) return next(new ApiError(500, "Request not created"));

  // Send email notification to receiver
  try {
    const to = receiver.email;
    const subject = "New Connection Request on SkillSwap";
    const message = `
      Hello ${receiver.name}!

      You have received a new connection request from ${sender.name} (@${sender.username}) on SkillSwap.

      ${sender.name} wants to connect with you to learn from your skills and experience.

      To view and respond to this request:
      1. Log in to your SkillSwap account
      2. Go to the Chats section
      3. Check the "Requests" tab
      4. Accept or reject the request

      Best regards,
      The SkillSwap Team
    `;

    await sendMail(to, subject, message);
    console.log("Connection request email sent to:", receiver.email);
  } catch (emailError) {
    console.log("Error sending email notification:", emailError);
    // Don't fail the request creation if email fails
  }

  res.status(201).json(new ApiResponse(201, newRequest, "Request created successfully"));
});

export const getRequests = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside getRequests Controller function ********");

  const receiverID = req.user._id;

  const requests = await Request.find({ receiver: receiverID, status: "Pending" }).populate("sender");

  if (requests.length > 0) {
    const sendersDetails = requests.map((request) => {
      return request._doc.sender;
    });
    return res.status(200).json(new ApiResponse(200, sendersDetails, "Requests fetched successfully"));
  }

  return res.status(200).json(new ApiResponse(200, requests, "Requests fetched successfully"));
});

export const acceptRequest = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside acceptRequest Controller function ********");

  const { requestId } = req.body;
  const senderId = req.user._id;

  // console.log("RequestId: ", requestId);
  // console.log("Sender ID: ", senderId);

  const existingRequest = await Request.find({ sender: requestId, receiver: senderId });

  // console.log("Existing Request: ", existingRequest);

  if (existingRequest.length === 0) {
    throw new ApiError(400, "Request does not exist");
  }

  const existingChat = await Chat.find({ users: { $all: [requestId, senderId] } });

  if (existingChat.length > 0) {
    throw new ApiError(400, "Chat already exists");
  }

  const chat = await Chat.create({
    users: [requestId, senderId],
  });

  if (!chat) return next(new ApiError(500, "Chat not created"));

  await Request.findOneAndUpdate(
    { sender: requestId, receiver: senderId },
    {
      status: "Connected",
    }
  );

  res.status(201).json(new ApiResponse(201, chat, "Request accepted successfully"));
});

export const rejectRequest = asyncHandler(async (req, res, next) => {
  console.log("\n******** Inside rejectRequest Controller function ********");

  const { requestId } = req.body;
  const senderId = req.user._id;

  // console.log("RequestId: ", requestId);
  // console.log("Sender ID: ", senderId);

  const existingRequest = await Request.find({ sender: requestId, receiver: senderId, status: "Pending" });

  // console.log("Existing Request: ", existingRequest);

  if (existingRequest.length === 0) {
    throw new ApiError(400, "Request does not exist");
  }

  await Request.findOneAndUpdate({ sender: requestId, receiver: senderId }, { status: "Rejected" });

  res.status(200).json(new ApiResponse(200, null, "Request rejected successfully"));
});
