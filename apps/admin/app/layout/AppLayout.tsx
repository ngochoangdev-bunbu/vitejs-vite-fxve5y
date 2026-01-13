"use client"
import SidebarProvider from "../context/SidebarContext";
import { useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LayoutContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname();
  const [currentUserName, setCurrentUserName] = useState<string>("");

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  useEffect(() => {
    fetchMe();
  }, [pathname]);

  const fetchMe = async () => {
    const cookies = document.cookie.split("; ");
    const userIdCookie = cookies.find((cookie) =>
      cookie.includes("LastAuthUser"),
    );
    if (userIdCookie) {
      const userId = userIdCookie.split("=")[1];
      setCurrentUserName(userId);
    } else {
      setCurrentUserName("");
    }
  };

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar currentUserName={currentUserName} />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader currentUserName={currentUserName} />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default AppLayout;