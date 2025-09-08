import { useCallback, useState } from "react";
import {
  useAccount,
  useWalletClient,
  useWriteContract,
} from "wagmi"; // Remove useWaitForTransactionReceipt
import { usePublicClient } from "wagmi"; // Add this
import {
  QUADRATIC_GOVERNACE_CONTRACT_ABI,
} from "@/config/abi";
import useChairPerson from "./useChairPerson";
import { toast } from "sonner";
import { isAddressEqual } from "viem";
import { Address } from "viem"; // Assuming you have this for type

const useCreateProposal = (balance?: number) => {
  const { address } = useAccount();
  const chairperson = useChairPerson();
  const { writeContractAsync, isPending } = useWriteContract();
  const walletClient = useWalletClient();
  const publicClient = usePublicClient(); // Add this
  const [isSuccess, setIsSuccess] = useState(false)

  const createProposal = useCallback(
    async (
      description: string,
      recipient: Address,
      amountInWei: number,
      durationInSeconds: number
    ) => {
      if (!address || !walletClient || !publicClient) {
        toast.error("Not connected", {
          description: "Kindly connect your address",
        });
        return;
      }
      if (balance && balance < amountInWei) {
        toast.error("Insufficient balance", {
          description: "Amount is more than available balance",
        });
        return;
      }
      if (chairperson && !isAddressEqual(address, chairperson)) {
        toast.error("Unauthorized", {
          description: "This action is only available to the chairperson",
        });
        return;
      }
      console.log({durationInSeconds})

      try {
        const txHash = await writeContractAsync({
          address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
          abi: QUADRATIC_GOVERNACE_CONTRACT_ABI,
          functionName: "createProposal",
          // @ts-ignore
          args: [description, recipient, BigInt(amountInWei), durationInSeconds], // Use BigInt for uint args
        });

        const txReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        console.log("txHash: ", txHash, txReceipt);

        if (txReceipt.status === "success") {
          setIsSuccess(true)
          toast.success("Proposal created successfully", {
            description: "You have successfully created a proposal",
          });
          // No need to refetch here. the event watcher in useGetAllProposals handles it automatically
        } else {
          toast.error("Transaction failed");
        }
      } catch (error) {
        console.error("Error creating proposal:", error);
        toast.error("Transaction failed", {
          description: "Please try again",
        });
      }
    },
    [address, chairperson, writeContractAsync, walletClient, publicClient, balance] // Add deps
  );

  return {createProposal, isPending, isSuccess}
};

export default useCreateProposal;