import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoose";
import User from "../../../../../mongoDB/User";

export async function POST(req: Request) {
  try {
    console.log("🔄 Reset password request received");

    await connectDB();
    console.log("✅ Database connected");

    const { token, password } = await req.json();
    console.log("🔑 Token received:", token);
    console.log("🔒 Password received:", password ? "***" : "none");

    if (!token || !password) {
      console.log("❌ Missing token or password");
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log("❌ Password too short");
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    console.log("🔍 Searching for user with valid reset token...");

    // Find user by valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    console.log(
      "👤 User found with token:",
      user ? `Yes (${user.email})` : "No"
    );

    if (!user) {
      // Debug: Check if token exists but expired
      const expiredUser = await User.findOne({ resetPasswordToken: token });
      if (expiredUser) {
        console.log("⏰ Token exists but expired");
        console.log("Token expiry:", expiredUser.resetPasswordExpires);
        console.log("Current time:", new Date());
      } else {
        console.log("❌ No user found with this token");
      }

      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    console.log("✅ Valid token found for user:", user.email);

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Use findOneAndUpdate to clear reset token and update password
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: "",
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user password");
    }

    console.log("✅ Password reset successful");
    console.log("✅ Reset token cleared from database");

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
