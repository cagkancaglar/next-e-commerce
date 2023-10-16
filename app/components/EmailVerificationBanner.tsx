import React from "react";

export default function EmailVerificationBanner() {
  return (
    <div className="p-2 text-center bg-blue-50 rounded-full">
      <span>It looks like you haven't verified your email.</span>
      <button className="ml-2 font-semibold underline">
        Get verification link.
      </button>
    </div>
  );
}
