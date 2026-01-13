"use client";

import React, { ReactNode, useEffect, useState } from "react";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentUserName, setCurrentUserName] = useState<string>("");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchMe();
  }, []);

  const fetchMe = async () => {
    const cookies = document.cookie.split("; ");
    const userIdCookie = cookies.find((cookie) =>
      cookie.includes("LastAuthUser"),
    );
    if (userIdCookie) {
      const userId = userIdCookie.split("=")[1];
      const client = generateClient<Schema>();
      const response = await client.models.User.get({ id: userId });
      if (response.data) {
        const userName = response.data.name;
        setCurrentUserName(userName);
        sessionStorage.setItem("currentUserName", userName);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header userName={currentUserName} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
