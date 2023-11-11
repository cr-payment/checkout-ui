import React, { ReactNode } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import { Spinner } from "./Spinner";

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
};

export function ButtonSui({ children, className, disabled, isLoading, onClick }: Props): React.ReactElement<Props> {
  return (
    <button
      className={
        "bg-btn " +
        twMerge(
          clsx(
            "flex items-center justify-center space-x-2",
            "font-semibold text-lg text-white py-4 px-12 rounded-full transition-colors bg-pGreen-400",
            disabled
              ? "disabled:bg-slate-600 disabled:bg-none"
              : "hover:bg-white hover:text-dark-600 hover:bg-none hover:shadow-button",
            className,
          ),
        )
      }
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading && <Spinner className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
}
