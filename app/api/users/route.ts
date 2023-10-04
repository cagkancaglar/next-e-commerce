import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { NewUserRequest } from "@/app/types";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import EmailVerificationToken from "@models/emailVerificationToken";
import crypto from "crypto";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;

  await startDb();
  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "196b9845497f3c",
      pass: "812b27a056ad4a",
    },
  });

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  await transport.sendMail({
    from: "verification@nextecom.com",
    to: newUser.email,
    html: `<h1>Please verify your email by clicking on <a href="${verificationUrl}">this link </a> </h1>`,
  });

  return NextResponse.json(newUser);
};
