import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(url: string) {
  return new URL(url, process.env.NEXT_PUBLIC_SITE_URL).toString();
}
