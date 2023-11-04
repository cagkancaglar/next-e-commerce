import EmailVerificationBanner from "@components/EmailVerificationBanner";
import ProfileForm from "@components/ProfileForm";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const fetchUserProfile = async () => {
  const session = await auth();
  if (!session) return redirect("/auth/login");

  await startDb();
  const user = await UserModel.findById(session.user.id);
  if (!user) return redirect("/auth/login");
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar?.url,
    verified: user.verified,
  };
};

export default async function Profile() {
  const profile = await fetchUserProfile();
  return (
    <div>
      <EmailVerificationBanner id={profile.id} verified={profile.verified} />
      <ProfileForm
        avatar={profile.avatar}
        email={profile.email}
        name={profile.name}
        id={profile.id}
      />
    </div>
  );
}
