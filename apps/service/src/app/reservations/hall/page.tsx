import React, { Suspense } from "react";
import { ReservationForm } from "./components/ReservationForm";

export default async function Page(): Promise<React.JSX.Element> {
  // TODO: 認証機能実装後にユーザー情報を取得する処理を追加
  // const userId = await getUserId();
  // let user: User | null = null;
  // if (userId.length > 0) {
  //   user = await fetchUser(userId);
  // }
  const user = null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReservationForm user={user} />
    </Suspense>
  );
}
