"use client";
import React, { useState } from "react";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";

export default function EmailVerificationBanner() {
  const { profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (profile?.verified) return null;

  const applyForReverification = async () => {
    if (!profile) return;

    setSubmitting(true);
    const res = await fetch("/api/users/verify?userId=" + profile.id, {
      method: "GET",
    });

    const { message, error } = await res.json();

    if (!res.ok && error) {
      toast.error(error);
    }

    toast.success(message);
    setSubmitting(false);
  };

  return (
    <div className="p-2 text-center bg-blue-50">
      <span>It looks like you haven't verified your email.</span>
      <button
        onClick={applyForReverification}
        className="ml-2 font-semibold underline"
        disabled={submitting}
      >
        {submitting ? "Generating link..." : "Get verification link."}
      </button>
    </div>
  );
}
