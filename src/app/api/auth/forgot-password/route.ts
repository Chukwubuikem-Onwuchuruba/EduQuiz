import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongoose";
import User from "../../../../../mongoDB/User";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    console.log("🔐 Forgot password request received");

    await connectDB();
    console.log("✅ Database connected");

    const { email } = await req.json();
    console.log("📧 Email received:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log("👤 User found:", user ? `Yes (${user.email})` : "No");

    // Always return success to prevent email enumeration
    if (!user) {
      console.log("❌ No user found with that email");
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log("🔑 Generated reset token:", resetToken);
    console.log("⏰ Token expires at:", resetTokenExpiry);

    // Use findOneAndUpdate instead of save() to avoid virtual field issues
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry,
        },
      },
      {
        new: true, // Return the updated document
        runValidators: true,
      }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user with reset token");
    }

    console.log("💾 User updated with reset token");
    console.log(
      "✅ Updated user resetPasswordToken:",
      updatedUser.resetPasswordToken
    );
    console.log(
      "✅ Updated user resetPasswordExpires:",
      updatedUser.resetPasswordExpires
    );

    // Verify the token was saved by querying fresh from DB
    const verifiedUser = await User.findOne({
      _id: user._id,
      resetPasswordToken: resetToken,
    });

    if (!verifiedUser) {
      console.error("❌ CRITICAL: Token verification failed!");
      throw new Error("Reset token was not persisted to database");
    }

    console.log("✅ Token verified in database");

    // Send email
    console.log("📨 Sending password reset email...");
    await sendPasswordResetEmail(email, resetToken);
    console.log("✅ Password reset email sent");

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
