import { redirect } from "next/navigation";
import React from "react";

interface Props {
  searchParams: { token: string; userId: string };
}

export default function Verify(props: Props) {
  const { token, userId } = props.searchParams;

  if (!token || !userId) return redirect("/404");

  return (
    <div className="text-3xl opacity-70 text-center p-5 animate-pulse">
      <p>Please wait...</p>
      <p> We are verifing your email</p>
    </div>
  );
}
