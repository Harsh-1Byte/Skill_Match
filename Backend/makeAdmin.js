import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js";

dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/SkillSwap`
    );
    console.log(
      `\n MongoDB connected: ${connectionInstance.connection.host} \n`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

const makeAdmin = async () => {
  try {
    await connectDB();
    
    // Get command line arguments
    const args = process.argv.slice(2);
    const email = args[0];
    
    if (!email) {
      console.log("Usage: node makeAdmin.js <email>");
      console.log("Example: node makeAdmin.js your-email@gmail.com");
      process.exit(1);
    }
    
    // Find user by email
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.log(`User with email ${email} not found.`);
      console.log("Available users:");
      const allUsers = await User.find().select('name email username role');
      allUsers.forEach(u => {
        console.log(`- ${u.name} (${u.username}) - ${u.email} - Role: ${u.role}`);
      });
      process.exit(1);
    }
    
    // Update user role to admin
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { role: 'admin' },
      { new: true }
    );
    
    console.log(`✅ Successfully promoted ${updatedUser.name} (${updatedUser.username}) to admin role!`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`Role: ${updatedUser.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error making user admin:", error);
    process.exit(1);
  }
};

makeAdmin(); 