"use client";

import { useRouter } from "next/navigation";
import { LogoutButton } from "../LogoutButton";

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const router = useRouter();

  // MISOCA API用トークンの取得
  const handleMisocaTokenClick = async () => {
    const auth_uri = process.env.NEXT_PUBLIC_MISOCA_AUTH_ENDPOINT;
    const client_id = process.env.NEXT_PUBLIC_MISOCA_APPLICATION_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_MISOCA_REDIRECT_URL;
    const scope = "read write";

    const response = await fetch(`/api/misoca-token-refresh`, {
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
    <header className="bg-white">
      <nav className="flex p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span>rental space system</span>
          </a>
        </div>
        <div className="flex lg:flex-1">
          <button
            type="button"
            className="text-white bg-cyan-600 font-medium rounded-lg px-3"
            onClick={handleMisocaTokenClick}
          >
            MISOCA Token
          </button>
        </div>
        <div className="flex lg:flex-1 lg:justify-end items-center space-x-6">
          <p>管理者</p>
          <p>{userName}</p>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
