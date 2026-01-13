import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  desc?: React.ReactNode;
}

export function BasicInput({ label, desc, className, ...props }: Props): React.JSX.Element {
  return (
    <div className={twMerge(clsx("block text-sm leading-6 font-medium text-gray-900"), className)}>
      <p>
        {label}
        {label && props.required && <span className="text-red-700">*</span>}
      </p>
      {desc && <p className="text-sm leading-6 text-gray-600">{desc}</p>}
      <input
        {...props}
        className={clsx(
          "block w-full px-2 py-1.5",
          "rounded-md border-0 shadow-xs ring-1 ring-gray-300 ring-inset",
          "text-gray-900 placeholder:text-gray-400",
          "focus:ring-2 focus:ring-indigo-600 focus:ring-inset",
          "sm:text-sm sm:leading-6"
        )}
      />
    </div>
  );
}
