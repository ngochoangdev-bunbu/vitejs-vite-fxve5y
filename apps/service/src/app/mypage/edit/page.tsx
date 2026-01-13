"use client";

import Layout from "@/app/components/user/Layout";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import { useEffect, useState } from "react";
import Spinner from "@/app/components/Spinner";

interface User {
  id: string;
  name: string;
  company_name: string;
  tel: string;
  email: string;
}

export default function Mypage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchMe();
  }, []);

  const fetchMe = async () => {
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find((cookie) =>
      cookie.includes("LastAuthUser"),
    );
    if (userCookie) {
      const currentUser = userCookie.split("=")[1];
      const client = generateClient<Schema>();
      const response = await client.models.User.get({ id: currentUser });
      if (response.data) {
        setUser({
          id: response.data.id,
          name: response.data.name,
          company_name: response.data.company_name!,
          tel: response.data.tel,
          email: response.data.email,
        });
      }
    }
  };

  const handleSaveClick = async () => {
    try {
      setIsLoading(true);
      const client = generateClient<Schema>();
      await client.models.User.update({
        id: user!.id,
        name: user!.name,
        company_name: user!.company_name,
        tel: user!.tel,
        email: user!.email,
      });
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl py-6 mt-12">
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">基本情報</h3>
          <div className="mb-6">
            <div className="text-gray-600 flex flex-col lg:flex-row mb-4 ">
              <span className="font-bold lg:w-24">名前</span>
              <input
                type="text"
                className="border rounded-sm px-2 py-1 grow lg:w-full"
                value={user?.name}
                onChange={(e) => {
                  setUser((prevUser) => {
                    if (!prevUser) return null;
                    return {
                      ...prevUser,
                      name: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="text-gray-600 flex flex-col lg:flex-row mb-4 ">
              <span className="font-bold lg:w-24">法人名</span>
              <input
                type="text"
                className="border rounded-sm px-2 py-1 grow lg:w-full"
                value={user?.company_name}
                onChange={(e) => {
                  setUser((prevUser) => {
                    if (!prevUser) return null;
                    return {
                      ...prevUser,
                      company_name: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="text-gray-600 flex flex-col lg:flex-row mb-4 ">
              <span className="font-bold lg:w-24">電話</span>
              <input
                type="text"
                className="border rounded-sm px-2 py-1 grow lg:w-full"
                value={user?.tel}
                onChange={(e) => {
                  setUser((prevUser) => {
                    if (!prevUser) return null;
                    return {
                      ...prevUser,
                      tel: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="text-gray-600 flex flex-col lg:flex-row mb-4 ">
              <span className="font-bold lg:w-24">メール</span>
              <input
                type="text"
                className="border rounded-sm px-2 py-1 grow lg:w-full"
                value={user?.email}
                onChange={(e) => {
                  setUser((prevUser) => {
                    if (!prevUser) return null;
                    return {
                      ...prevUser,
                      email: e.target.value,
                    };
                  });
                }}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-end">
              <Spinner />
            </div>
          ) : (
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={async () => {
                  await handleSaveClick();
                }}
              >
                セーブ
              </button>
              <Link
                href="/mypage"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                キャンセル
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
