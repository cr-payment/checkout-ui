import { ReactElement } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { AnimatePresence, m } from "framer-motion";

import { CloseIcon } from "./CloseIcon";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "lg" | "md";
  title?: string;
  className?: string;
  preventBackdropClick?: boolean;
};

export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  title,
  className,
  preventBackdropClick = false,
}: Props): ReactElement {
  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <Dialog.Root open={isOpen} onOpenChange={!preventBackdropClick ? onClose : undefined}>
          <Dialog.Portal forceMount>
            <AnimatedDialogOverlay
              animate={{ opacity: 1 }}
              className={clsx(
                "fixed inset-0 z-40 flex items-end justify-center pb-0 sm:items-center sm:py-24 sm:pb-24",
                "bg-black bg-opacity-60",
              )}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              forceMount
            >
              <AnimatedDialogContent
                animate={{ translateY: "0%" }}
                className={clsx(
                  "flex p-4 max-h-full min-h-[80%] w-full flex-col rounded-lg sm:min-h-[100px] sm:max-w-[450px] bg-dark-600",
                  "border border-white border-opacity-20 space-y-6 ",
                  {
                    "md:max-w-[800px]": size === "lg",
                  },
                  className,
                )}
                exit={{ translateY: "100%" }}
                initial={{ translateY: "100%" }}
                transition={{ duration: 0.15 }}
                forceMount
              >
                <div className="relative text-white font-semibold text-xl">
                  {title}
                  <div className="w-3.5 h-3.5 absolute right-0 top-1 cursor-pointer" onClick={onClose}>
                    <CloseIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className={clsx("flex-1 overflow-y-auto")}>{children}</div>
              </AnimatedDialogContent>
            </AnimatedDialogOverlay>
          </Dialog.Portal>
        </Dialog.Root>
      ) : null}
    </AnimatePresence>
  );
}

const AnimatedDialogOverlay = m(Dialog.Overlay);
const AnimatedDialogContent = m(Dialog.Content);
