import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CgSpinner } from "react-icons/cg";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Spinner({ className, hidden, ...props }: Props) {
  return (
    <div {...props} className={twMerge(clsx("size-8", className))} hidden={hidden}>
      <div className={clsx("animate-pulse")}>
        <CgSpinner className="animate-spin" size={"100%"} />
      </div>
    </div>
  );
}
