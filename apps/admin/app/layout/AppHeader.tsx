"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../components/header/UserDropdown";

interface AppHeaderProps {
  currentUserName: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUserName }) => {
  const router = useRouter();

  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // MISOCA API用トークンの取得
  const handleMisocaTokenClick = async () => {
    const auth_uri = process.env.NEXT_PUBLIC_MISOCA_AUTH_ENDPOINT;
    const client_id = process.env.NEXT_PUBLIC_MISOCA_APPLICATION_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_MISOCA_REDIRECT_URL;
    const scope = "read write";

    const response = await fetch(`/api/misoca/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.message === "Failed to refresh") {
      //リフレッシュトークンが無効な場合、ログインページへ
      const authorize_uri = `${auth_uri}/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
      router.push(authorize_uri);
    }
  };

  return (
    <header className="sticky top-0 z-99999 flex w-full border-gray-200 bg-white lg:border-b dark:border-gray-800 dark:bg-gray-900">
      <div className="flex grow flex-col items-center justify-between lg:flex-row lg:px-6">
        <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button
              className="z-99999 h-10 w-10 items-center justify-center rounded-lg border-gray-200 text-gray-500 lg:flex lg:h-11 lg:w-11 lg:border dark:border-gray-800 dark:text-gray-400"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isMobileOpen ? "✕" : "☰"}
            </button>
            <button
              type="button"
              className="rounded-lg bg-cyan-600 px-3 font-medium text-white"
              onClick={handleMisocaTokenClick}
            >
              MISOCA Token
            </button>
          </div>
          <Link href="/dashboard" className="lg:hidden">
            <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={120} height={40} />
            <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={120} height={40} />
          </Link>
          <button
            onClick={toggleApplicationMenu}
            className="z-99999 flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
          >
            •••
          </button>
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } shadow-theme-md w-full items-center justify-end gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0 lg:shadow-none`}
        >
          {/* <!-- User Area --> */}
          {currentUserName && <UserDropdown userName={currentUserName} />}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
