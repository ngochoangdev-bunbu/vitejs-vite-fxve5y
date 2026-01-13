"use client";

import { Provider } from "jotai";
import React from "react";

export function FormProviders({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <Provider>{children}</Provider>;
}
