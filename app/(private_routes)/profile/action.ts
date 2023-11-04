"use server";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { UserProfileToUpdate } from "@/app/types";

export const updateUserProfile = async (info: UserProfileToUpdate) => {
  try {
    await startDb();
    await UserModel.findByIdAndUpdate(info.id, {
      name: info.name,
      avatar: info.avatar,
    });
  } catch (error) {
    console.log("Error white updating the user");
    throw error;
  }
};
