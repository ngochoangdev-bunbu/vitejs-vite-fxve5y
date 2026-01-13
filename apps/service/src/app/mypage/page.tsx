import Header from "../components/user/Header";
import Link from "next/link";
import { cookies } from "next/headers";
import { cookieBasedClient } from "@/utils/amplifyServerUtils";

interface User {
  name: string;
  companyName: string;
  tel: string;
  email: string;
}

const Mypage: React.FC = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get(
    `CognitoIdentityServiceProvider.${process.env.COGNITO_USER_POOL_CLIENT_ID}.LastAuthUser`,
  );
  let user: User | null = null;
  if (userId) {
    const response = await cookieBasedClient.models.User.get({
      id: userId.value,
    });
    if (response.data) {
      user = {
        name: response.data.name,
        companyName: response.data.company_name!,
        tel: response.data.tel,
        email: response.data.email,
      };
    }
  }

  if (!user) {
    return <div>Error</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        {userId && <Header userName={user.name} />}
        <main>
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl py-6 mt-12">
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4">基本情報</h3>
              <div className="mb-6">
                <div className="text-gray-600 flex flex-col lg:flex-row mb-6">
                  <span className="font-bold lg:w-24">名前</span>
                  <span className="lg:w-full">{user.name}</span>
                </div>
                <div className="text-gray-600 flex flex-col lg:flex-row mb-6">
                  <span className="font-bold lg:w-24">法人名</span>
                  <span className="lg:w-full">{user.companyName}</span>
                </div>
                <div className="text-gray-600 flex flex-col lg:flex-row mb-6">
                  <span className="font-bold lg:w-24">電話</span>
                  <span className="lg:w-full">{user.tel}</span>
                </div>
                <div className="text-gray-600 flex flex-col lg:flex-row mb-6">
                  <span className="font-bold lg:w-24">メール</span>
                  <span className="lg:w-full">{user.email}</span>
                </div>
              </div>
              <div className="flex justify-end px-6">
                <Link
                  href="/mypage/edit"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  編集
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Mypage;
