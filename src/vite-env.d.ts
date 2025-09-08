/// <reference types="vite/client" />

type address = `0x${string}`;

type Proposal = {
  id: number;
  description: string | undefined;
  recipient: `0x${string}` | undefined;
  amount: number;
  deadline: number;
};