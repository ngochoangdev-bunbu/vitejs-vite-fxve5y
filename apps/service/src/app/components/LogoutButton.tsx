"use client";

import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogoutClick = async () => {
    await signOut({ global: true });
    router.push("/login");
  };

  return (
    <button
      type="button"
      className="text-white bg-red-600 font-medium rounded-lg px-3"
      onClick={handleLogoutClick}
    >
      Logout
    </button>
  );
};
