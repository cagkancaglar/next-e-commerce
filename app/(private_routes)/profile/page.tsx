import ProfileForm from "@/app/components/ProfileForm";
import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const fetchUserProfile = async () => {
  const session = await auth();
  if (!session) return redirect("/auth/login");

  await startDb();
  const user = await UserModel.findById(session.user.id);
  return {
    id: user?._id.toString(),
    name: user?.name,
    email: user?.email,
    avatar: user?.avatar?.url,
  };
};

export default async function Profile() {
  const profile = await fetchUserProfile();
  return (
    <div>
      <ProfileForm
        avatar={profile.avatar}
        email={profile.email}
        name={profile.name}
        id={profile.id}
      />
    </div>
  );
}
