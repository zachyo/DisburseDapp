import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAddress } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string, length: number) => {
  if (!isAddress(address)) return "";

  return address.slice(0, length + 2) + "..." + address.slice(-length);
};
