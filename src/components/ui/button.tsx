import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "large";
type SharedProps = { children: ReactNode; variant?: ButtonVariant; size?: ButtonSize; className?: string };
type LinkButtonProps = SharedProps & { href: string };
type NativeButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonProps = LinkButtonProps | NativeButtonProps;

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary !text-white hover:bg-primary-soft",
  secondary: "border border-border bg-white !text-primary hover:border-primary hover:bg-surface",
  ghost: "text-primary hover:bg-surface",
};
const sizes: Record<ButtonSize, string> = { default: "min-h-11 px-5 text-sm", large: "min-h-14 px-7 text-base" };

export default function Button({ children, variant = "primary", size = "default", className = "", ...props }: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-[var(--radius-sm)] font-bold transition-colors duration-[var(--motion-fast)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;
  if ("href" in props && props.href) return <Link className={classes} href={props.href}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
