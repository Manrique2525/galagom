import type { HTMLAttributes } from "react";

export default function Container({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mx-auto w-full max-w-[var(--container-width)] px-5 sm:px-8 lg:px-10 ${className}`} {...props} />;
}
