import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import AdminSidebar from "@components/AdminSidebar";

interface Props {
  children: ReactNode;
}

export default async function PrivateLayout({ children }: Props) {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return redirect("/auth/login");
  }

  return <AdminSidebar>{children}</AdminSidebar>;
}
