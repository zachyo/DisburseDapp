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

// Helper function to format a log into a proposal object
export const formatLogToProposal = (log: any): Proposal => ({
  id: Number(log.args.proposalId),
  description: log.args.description,
  recipient: log.args.recipient,
  amount: Number(log.args.amount),
  deadline: Number(log.args.deadline),
});