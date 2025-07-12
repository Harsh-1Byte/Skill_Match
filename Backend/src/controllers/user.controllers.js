import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Request } from "../models/request.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import { generateJWTToken_username } from "../utils/generateJWTToken.js";
import { uploadOnCloudinary } from "../config/connectCloudinary.js";
import { sendMail } from "../utils/SendMail.js";

export const userDetailsWithoutID = asyncHandler(async (req, res) => {
  console.log("\n******** Inside userDetailsWithoutID Controller function ********");

  return res.status(200).json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

export const UserDetails = asyncHandler(async (req, res) => {
  console.log("\n******** Inside UserDetails Controller function ********");
  const username = req.params.username;

  const user = await User.findOne({ username: username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const receiverID = user._id;
  const senderID = req.user._id;
  const request = await Request.find({
    $or: [
      { sender: senderID, receiver: receiverID },
      { sender: receiverID, receiver: senderID },
    ],
  });

  // console.log("request", request);

  const status = request.length > 0 ? request[0].status : "Connect";

  // console.log(" userDetail: ", userDetail);
  // console.log("user", user);
  return res
    .status(200)
    .json(new ApiResponse(200, { ...user._doc, status: status }, "User details fetched successfully"));
});

export const UnRegisteredUserDetails = asyncHandler(async (req, res) => {
  console.log("\n******** Inside UnRegisteredUserDetails Controller function ********");

  // console.log(" UnRegisteredUserDetail: ", userDetail);
  return res.status(200).json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

export const saveRegUnRegisteredUser = asyncHandler(async (req, res) => {
  console.log("\n******** Inside saveRegUnRegisteredUser Controller function ********");

  const { name, email, username, linkedinLink, githubLink, portfolioLink, skillsProficientAt, skillsToLearn } =
    req.body;
  // console.log("Body: ", req.body);

  if (!name || !email || !username || skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
    throw new ApiError(400, "Please provide all the details");
  }

  if (!email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
    throw new ApiError(400, "Please provide valid email");
  }

  if (username.length < 3) {
    throw new ApiError(400, "Username should be atleast 3 characters long");
  }

  if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
    throw new ApiError(400, "Please provide atleast one link");
  }

  const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
  const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
  if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
    throw new ApiError(400, "Please provide valid github and linkedin links");
  }

  const existingUser = await User.findOne({ username: username });

  if (existingUser) {
    throw new ApiError(400, "Username already exists");
  }

  const user = await UnRegisteredUser.findOneAndUpdate(
    { email: email },
    {
      name: name,
      username: username,
      linkedinLink: linkedinLink,
      githubLink: githubLink,
      portfolioLink: portfolioLink,
      skillsProficientAt: skillsProficientAt,
      skillsToLearn: skillsToLearn,
    }
  );

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }
  // console.log(" UnRegisteredUserDetail: ", userDetail);
  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveEduUnRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveEduUnRegisteredUser Function *******");

  const { education, email } = req.body;
  if (education.length === 0) {
    throw new ApiError(400, "Education is required");
  }
  education.forEach((edu) => {
    // console.log("Education: ", edu);
    if (!edu.institution || !edu.degree) {
      throw new ApiError(400, "Please provide all the details");
    }
    if (
      !edu.startDate ||
      !edu.endDate ||
      !edu.score ||
      edu.score < 0 ||
      edu.score > 100 ||
      edu.startDate > edu.endDate
    ) {
      throw new ApiError(400, "Please provide valid score and dates");
    }
  });

  const user = await UnRegisteredUser.findOneAndUpdate({ email: email }, { education: education });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveAddUnRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveAddUnRegisteredUser Function *******");

  const { bio, projects, email } = req.body;
  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }
  if (bio.length > 500) {
    throw new ApiError(400, "Bio should be less than 500 characters");
  }

  if (projects.size > 0) {
    projects.forEach((project) => {
      if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
        throw new ApiError(400, "Please provide all the details");
      }
      if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        throw new ApiError(400, "Please provide valid project link");
      }
      if (project.startDate > project.endDate) {
        throw new ApiError(400, "Please provide valid dates");
      }
    });
  }

  const user = await UnRegisteredUser.findOneAndUpdate({ email: email }, { bio: bio, projects: projects });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const registerUser = async (req, res) => {
  console.log("\n******** Inside registerUser function ********");
  // First check if the user is already registered
  // if the user is already registerd than send a message that the user is already registered
  // redirect him to the discover page
  // if the user is not registered than create a new user and redirect him to the discover page after generating the token and setting the cookie and also delete the user detail from unregistered user from the database
  console.log("User:", req.user);

  const {
    name,
    email,
    username,
    linkedinLink,
    githubLink,
    portfolioLink,
    skillsProficientAt,
    skillsToLearn,
    education,
    bio,
    projects,
  } = req.body;

  if (!name || !email || !username || skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
    throw new ApiError(400, "Please provide all the details");
  }
  if (!email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
    throw new ApiError(400, "Please provide valid email");
  }
  if (username.length < 3) {
    throw new ApiError(400, "Username should be atleast 3 characters long");
  }
  if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
    throw new ApiError(400, "Please provide atleast one link");
  }
  const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
  const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
  if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
    throw new ApiError(400, "Please provide valid github and linkedin links");
  }
  if (education.length === 0) {
    throw new ApiError(400, "Education is required");
  }
  education.forEach((edu) => {
    if (!edu.institution || !edu.degree) {
      throw new ApiError(400, "Please provide all the details");
    }
    if (
      !edu.startDate ||
      !edu.endDate ||
      !edu.score ||
      edu.score < 0 ||
      edu.score > 100 ||
      edu.startDate > edu.endDate
    ) {
      throw new ApiError(400, "Please provide valid score and dates");
    }
  });
  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }
  if (bio.length > 500) {
    throw new ApiError(400, "Bio should be less than 500 characters");
  }
  if (projects.size > 0) {
    projects.forEach((project) => {
      if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
        throw new ApiError(400, "Please provide all the details");
      }
      if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        throw new ApiError(400, "Please provide valid project link");
      }
      if (project.startDate > project.endDate) {
        throw new ApiError(400, "Please provide valid dates");
      }
    });
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    throw new ApiError(400, "User Already registered");
  }

  const checkUsername = await User.findOne({ username: username });
  if (checkUsername) {
    throw new ApiError(400, "Username already exists");
  }

  const newUser = await User.create({
    name: name,
    email: email,
    username: username,
    linkedinLink: linkedinLink,
    githubLink: githubLink,
    portfolioLink: portfolioLink,
    skillsProficientAt: skillsProficientAt,
    skillsToLearn: skillsToLearn,
    education: education,
    bio: bio,
    projects: projects,
    picture: req.user.picture,
  });

  if (!newUser) {
    throw new ApiError(500, "Error in saving user details");
  }

  await UnRegisteredUser.findOneAndDelete({ email: email });

  const jwtToken = generateJWTToken_username(newUser);
  const expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
  res.cookie("accessToken", jwtToken, { httpOnly: true, expires: expiryDate, secure: false });
  res.clearCookie("accessTokenRegistration");
  return res.status(200).json(new ApiResponse(200, newUser, "NewUser registered successfully"));
};

export const saveRegRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveRegRegisteredUser Function *******");

  const { name, username, linkedinLink, githubLink, portfolioLink, skillsProficientAt, skillsToLearn, picture } =
    req.body;

  console.log("Body: ", req.body);

  if (!name || !username || skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
    throw new ApiError(400, "Please provide all the details");
  }

  if (username.length < 3) {
    throw new ApiError(400, "Username should be atleast 3 characters long");
  }

  if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
    throw new ApiError(400, "Please provide atleast one link");
  }

  const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
  const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
  if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
    throw new ApiError(400, "Please provide valid github and linkedin links");
  }

  const user = await User.findOneAndUpdate(
    { username: req.user.username },
    {
      name: name,
      username: username,
      linkedinLink: linkedinLink,
      githubLink: githubLink,
      portfolioLink: portfolioLink,
      skillsProficientAt: skillsProficientAt,
      skillsToLearn: skillsToLearn,
      picture: picture,
    }
  );

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveEduRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveEduRegisteredUser Function *******");

  const { education } = req.body;

  if (education.length === 0) {
    throw new ApiError(400, "Education is required");
  }

  education.forEach((edu) => {
    if (!edu.institution || !edu.degree) {
      throw new ApiError(400, "Please provide all the details");
    }
    if (
      !edu.startDate ||
      !edu.endDate ||
      !edu.score ||
      edu.score < 0 ||
      edu.score > 100 ||
      edu.startDate > edu.endDate
    ) {
      throw new ApiError(400, "Please provide valid score and dates");
    }
  });

  const user = await User.findOneAndUpdate({ username: req.user.username }, { education: education });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveAddRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveAddRegisteredUser Function *******");

  const { bio, projects } = req.body;

  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }

  if (bio.length > 500) {
    throw new ApiError(400, "Bio should be less than 500 characters");
  }

  if (projects.size > 0) {
    projects.forEach((project) => {
      if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
        throw new ApiError(400, "Please provide all the details");
      }
      if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        throw new ApiError(400, "Please provide valid project link");
      }
      if (project.startDate > project.endDate) {
        throw new ApiError(400, "Please provide valid dates");
      }
    });
  }

  const user = await User.findOneAndUpdate({ username: req.user.username }, { bio: bio, projects: projects });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

// export const updateRegisteredUser = asyncHandler(async (req, res) => {
//   console.log("******** Inside updateRegisteredUser Function *******");

//   const {
//     name,
//     username,
//     linkedinLink,
//     githubLink,
//     portfolioLink,
//     skillsProficientAt,
//     skillsToLearn,
//     education,
//     bio,
//     projects,
//   } = req.body;

//   if (!name || !username || skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
//     throw new ApiError(400, "Please provide all the details");
//   }

//   if (username.length < 3) {
//     throw new ApiError(400, "Username should be atleast 3 characters long");
//   }

//   if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
//     throw new ApiError(400, "Please provide atleast one link");
//   }

//   const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
//   const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
//   if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
//     throw new ApiError(400, "Please provide valid github and linkedin links");
//   }

//   if (education.length === 0) {
//     throw new ApiError(400, "Education is required");
//   }

//   education.forEach((edu) => {
//     if (!edu.institution || !edu.degree) {
//       throw new ApiError(400, "Please provide all the details");
//     }
//     if (
//       !edu.startDate ||
//       !edu.endDate ||
//       !edu.score ||
//       edu.score < 0 ||
//       edu.score > 100 ||
//       edu.startDate > edu.endDate
//     ) {
//       throw new ApiError(400, "Please provide valid score and dates");
//     }
//   });

//   if (!bio) {
//     throw new ApiError(400, "Bio is required");
//   }

//   if (bio.length > 500) {
//     throw new ApiError(400, "Bio should be less than 500 characters");
//   }

//   if (projects.size > 0) {
//     projects.forEach((project) => {
//       if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
//         throw new ApiError(400, "Please provide all the details");
//       }
//       if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
//         throw new ApiError(400, "Please provide valid project link");
//       }
//       if (project.startDate > project.endDate) {
//         throw new ApiError(400, "Please provide valid dates");
//       }
//     });
//   }

//   const user = await User.findOneAndUpdate(
//     { username: req.user.username },
//     {
//       name: name,
//       username: username,
//       linkedinLink: linkedinLink,
//       githubLink: githubLink,
//       portfolioLink: portfolioLink,
//       skillsProficientAt: skillsProficientAt,
//       skillsToLearn: skillsToLearn,
//       education: education,
//       bio: bio,
//       projects: projects,
//     }
//   );

//   if (!user) {
//     throw new ApiError(500, "Error in saving user details");
//   }

//   return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
// });

export const uploadPic = asyncHandler(async (req, res) => {
  const LocalPath = req.files?.picture[0]?.path;

  if (!LocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const picture = await uploadOnCloudinary(LocalPath);
  if (!picture) {
    throw new ApiError(500, "Error uploading picture");
  }

  res.status(200).json(new ApiResponse(200, { url: picture.url }, "Picture uploaded successfully"));
});

export const discoverUsers = asyncHandler(async (req, res) => {
  console.log("******** Inside discoverUsers Function *******");

  const webDevSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "NoSQL",
  ];

  const machineLearningSkills = [
    "Python",
    "Natural Language Processing",
    "Deep Learning",
    "PyTorch",
    "Machine Learning",
  ];

  // Get all users (excluding banned users)
  const users = await User.find({ 
    isBanned: { $ne: true },
    // If user is authenticated, exclude current user
    ...(req.user && { username: { $ne: req.user.username } })
  });

  console.log("Total users found for discover:", users.length);

  if (!users || users.length === 0) {
    console.log("No users found for discover");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { forYou: [], webDev: [], ml: [], others: [] },
          "No users available"
        )
      );
  }

  const usersToLearn = [];
  const webDevUsers = [];
  const mlUsers = [];
  const otherUsers = [];

  // Randomly shuffle the users array
  users.sort(() => Math.random() - 0.5);

  users.forEach((user) => {
    // If user is authenticated, try to match with their learning goals
    if (req.user && req.user.skillsToLearn && req.user.skillsToLearn.length > 0) {
      if (user.skillsProficientAt.some((skill) => req.user.skillsToLearn.includes(skill)) && usersToLearn.length < 5) {
        usersToLearn.push(user);
        return;
      }
    }
    
    // Categorize users by skills
    if (user.skillsProficientAt.some((skill) => webDevSkills.includes(skill)) && webDevUsers.length < 5) {
      webDevUsers.push(user);
    } else if (user.skillsProficientAt.some((skill) => machineLearningSkills.includes(skill)) && mlUsers.length < 5) {
      mlUsers.push(user);
    } else {
      if (otherUsers.length < 5) otherUsers.push(user);
    }
  });

  // If no users match the current user's learning goals, populate "For You" with random users
  if (usersToLearn.length === 0 && users.length > 0) {
    const randomUsers = users.slice(0, Math.min(5, users.length));
    usersToLearn.push(...randomUsers);
  }

  console.log("Discover users categorized:", {
    forYou: usersToLearn.length,
    webDev: webDevUsers.length,
    ml: mlUsers.length,
    others: otherUsers.length
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { forYou: usersToLearn, webDev: webDevUsers, ml: mlUsers, others: otherUsers },
        "Users fetched successfully"
      )
    );
});

export const sendScheduleMeet = asyncHandler(async (req, res) => {
  console.log("******** Inside sendScheduleMeet Function *******");

  const { date, time, username } = req.body;
  if (!date || !time || !username) {
    throw new ApiError(400, "Please provide all the details");
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const to = user.email;
  const subject = "Request for Scheduling a meeting";
  const message = `${req.user.name} has requested for a meet at ${time} time on ${date} date. Please respond to the request.`;

  await sendMail(to, subject, message);

  return res.status(200).json(new ApiResponse(200, null, "Email sent successfully"));
});

export const testDatabase = asyncHandler(async (req, res) => {
  console.log("******** Inside testDatabase Function *******");
  
  try {
    // Get all users
    const allUsers = await User.find({});
    console.log("Total users in database:", allUsers.length);
    
    // Search for specific users
    const manishUser = await User.findOne({ 
      $or: [
        { name: { $regex: /manish/i } },
        { username: { $regex: /manish/i } }
      ]
    });
    
    const harshwardhanUser = await User.findOne({ 
      $or: [
        { name: { $regex: /harshwardhan/i } },
        { username: { $regex: /harshwardhan/i } }
      ]
    });
    
    console.log("Manish user found:", manishUser ? {
      name: manishUser.name,
      username: manishUser.username,
      email: manishUser.email,
      isBanned: manishUser.isBanned
    } : "Not found");
    
    console.log("Harshwardhan user found:", harshwardhanUser ? {
      name: harshwardhanUser.name,
      username: harshwardhanUser.username,
      email: harshwardhanUser.email,
      isBanned: harshwardhanUser.isBanned
    } : "Not found");
    
    // Get all user names and usernames
    const userList = allUsers.map(user => ({
      name: user.name,
      username: user.username,
      email: user.email,
      isBanned: user.isBanned,
      rating: user.rating
    }));
    
    return res.status(200).json({
      success: true,
      totalUsers: allUsers.length,
      manishUser: manishUser ? {
        name: manishUser.name,
        username: manishUser.username,
        email: manishUser.email,
        isBanned: manishUser.isBanned
      } : null,
      harshwardhanUser: harshwardhanUser ? {
        name: harshwardhanUser.name,
        username: harshwardhanUser.username,
        email: harshwardhanUser.email,
        isBanned: harshwardhanUser.isBanned
      } : null,
      allUsers: userList
    });
    
  } catch (error) {
    console.log("Database test error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export const getFeaturedUsers = asyncHandler(async (req, res) => {
  console.log("******** Inside getFeaturedUsers Function *******");
  console.log("Request user:", req.user ? req.user.username : "No user logged in");

  // Get all users first to check if there are any users in the database
  const allUsers = await User.find({});
  console.log("Total users in database (including banned):", allUsers.length);

  const nonBannedUsers = await User.find({ isBanned: { $ne: true } });
  console.log("Total non-banned users in database:", nonBannedUsers.length);

  // Debug: Show all users and their data
  console.log("All users in database:");
  allUsers.forEach((user, index) => {
    console.log(`User ${index + 1}:`, {
      name: user.name,
      username: user.username,
      email: user.email,
      rating: user.rating,
      isBanned: user.isBanned,
      skillsCount: user.skillsProficientAt?.length || 0,
      bio: user.bio ? "Has bio" : "No bio",
      skills: user.skillsProficientAt
    });
  });

  if (nonBannedUsers.length === 0) {
    console.log("No non-banned users found in database, creating sample users");
    
    // Create sample users for demonstration
    const sampleUsers = [
      {
        username: "john_developer",
        name: "John Smith",
        email: "john@example.com",
        picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 4.8,
        bio: "Full-stack developer with 5+ years of experience in React, Node.js, and MongoDB. Passionate about creating scalable web applications.",
        skillsProficientAt: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
        skillsToLearn: ["Python", "Machine Learning", "Docker"]
      },
      {
        username: "sarah_designer",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        rating: 4.9,
        bio: "UI/UX designer and frontend developer. I love creating beautiful, user-friendly interfaces that solve real problems.",
        skillsProficientAt: ["UI/UX Design", "Figma", "CSS", "JavaScript", "React"],
        skillsToLearn: ["Python", "Data Science", "Animation"]
      },
      {
        username: "mike_data",
        name: "Mike Chen",
        email: "mike@example.com",
        picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 4.7,
        bio: "Data scientist and machine learning engineer. Specialized in Python, TensorFlow, and building predictive models.",
        skillsProficientAt: ["Python", "Machine Learning", "TensorFlow", "Pandas", "NumPy"],
        skillsToLearn: ["React", "Web Development", "Docker"]
      },
      {
        username: "emma_mobile",
        name: "Emma Wilson",
        email: "emma@example.com",
        picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        rating: 4.6,
        bio: "Mobile app developer with expertise in React Native and iOS development. I build apps that users love.",
        skillsProficientAt: ["React Native", "iOS", "JavaScript", "Swift", "Firebase"],
        skillsToLearn: ["Python", "Backend Development", "AWS"]
      },
      {
        username: "alex_devops",
        name: "Alex Rodriguez",
        email: "alex@example.com",
        picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        rating: 4.5,
        bio: "DevOps engineer and cloud specialist. I help teams deploy and scale applications efficiently.",
        skillsProficientAt: ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD"],
        skillsToLearn: ["Machine Learning", "Python", "React"]
      },
      {
        username: "lisa_qa",
        name: "Lisa Thompson",
        email: "lisa@example.com",
        picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        rating: 4.4,
        bio: "QA engineer and automation specialist. I ensure software quality through comprehensive testing strategies.",
        skillsProficientAt: ["Selenium", "Jest", "Cypress", "JavaScript", "Testing"],
        skillsToLearn: ["Python", "Machine Learning", "React"]
      }
    ];

    try {
      const createdUsers = await User.insertMany(sampleUsers);
      console.log("Sample users created:", createdUsers.length);
    } catch (error) {
      console.log("Error creating sample users:", error);
    }
  }

  // Use the same approach as discoverUsers - get all non-banned users
  const users = await User.find({ 
    isBanned: { $ne: true },
    // If user is authenticated, exclude current user (same as discover)
    ...(req.user && { username: { $ne: req.user.username } })
  });

  console.log("Users found for featured (same as discover logic):", users.length);

  if (!users || users.length === 0) {
    console.log("No users found for featured");
    return res
      .status(200)
      .json(
        new ApiResponse(200, [], "No featured users available")
      );
  }

  // Randomly shuffle and limit to 6 users (same as discover approach)
  const shuffledUsers = users.sort(() => Math.random() - 0.5);
  const featuredUsers = shuffledUsers.slice(0, 6);

  console.log("Featured users selected:", featuredUsers.length);
  console.log("Featured users:", featuredUsers.map(user => ({
    name: user.name,
    username: user.username,
    rating: user.rating,
    skills: user.skillsProficientAt,
    bio: user.bio ? "Has bio" : "No bio"
  })));

  // If user is logged in, add request status information
  if (req.user) {
    console.log("User is logged in, adding request status for user:", req.user.username);
    const usersWithRequestStatus = await Promise.all(
      featuredUsers.map(async (user) => {
        const request = await Request.findOne({
          $or: [
            { sender: req.user._id, receiver: user._id },
            { sender: user._id, receiver: req.user._id },
          ],
        });

        return {
          ...user._doc,
          requestStatus: request ? request.status : null,
        };
      })
    );

    console.log("Final featured users with request status:", usersWithRequestStatus.length);

    return res
      .status(200)
      .json(
        new ApiResponse(200, usersWithRequestStatus, "Featured users fetched successfully")
      );
  }

  // If user is not logged in, return users without request status
  console.log("User not logged in, returning users without request status");
  return res
    .status(200)
    .json(
      new ApiResponse(200, featuredUsers, "Featured users fetched successfully")
    );
});
