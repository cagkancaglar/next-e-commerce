import PasswordResetTokenModel from "@/app/models/passwordResetTokenModel";
import UserModel from "@/app/models/userModel";
import { ForgetPasswordRequest } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";

const POST = async (req: Request) => {
  const { email } = (await req.json()) as ForgetPasswordRequest;
  const user = await UserModel.findOne({ email });
  if (!email) {
    return NextResponse.json({ error: "Invalid email!" }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found!" }, { status: 404 });
  }

  // generate the token and send the link to the given email

  await PasswordResetTokenModel.findOneAndDelete({ user: user._id });
  const token = crypto.randomBytes(36).toString("hex");
  await PasswordResetTokenModel.create({
    user: user._id,
    token,
  });

  //send the link to the given email
};
