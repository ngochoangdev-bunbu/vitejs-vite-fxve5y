"use server";

import { Suspense } from "react";
import { ReservationConfirm } from "../components/ReservationConfirm";

export default async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReservationConfirm />
    </Suspense>
  );
}
