import { useCallback } from "react";
import {
  useAccount,
  useWalletClient,
  useWriteContract,
  useWaitForTransactionReceipt,
  // useReadContract,
} from "wagmi";
import {
  // GOVERNACE_ADDRESS_ABI,
  QUADRATIC_GOVERNACE_CONTRACT_ABI,
} from "@/config/abi";
import useChairPerson from "./useChairPerson";
import { toast } from "sonner";
import { isAddressEqual } from "viem";

const useCreateProposal = (balance?:number) => {
  const { address } = useAccount();
  const chairperson = useChairPerson();
  const { writeContractAsync } = useWriteContract();
  const walletClient = useWalletClient();

  // const res = useReadContract({
  //   abi: GOVERNACE_ADDRESS_ABI,
  //   address: import.meta.env.VITE_GOVERNACE_ADDRESS,
  //   functionName: "balanceOf",
  //   args: [import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT],
  // });

  // // const resultObject = JSON.parse(JSON.stringify(res));
  // console.log("resultObject: ", res.data);

  return useCallback(
    async (
      description: string,
      recipient: address,
      amountInWei: number,
      durationInSeconds: number
    ) => {
      if (!address || !walletClient) {
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

      const txHash = await writeContractAsync({
        address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
        abi: QUADRATIC_GOVERNACE_CONTRACT_ABI,
        functionName: "createProposal",
        // @ts-ignore
        args: [description, recipient, amountInWei, durationInSeconds],
      });

      const txReceipt = await useWaitForTransactionReceipt({ hash: txHash });

      console.log("txHash: ", txHash, txReceipt);

      if (txReceipt.status === "success") {
        toast.success("Create proposal succeussfully", {
          description: "You have successfully created a proposal",
        });
      }
    },
    [address, chairperson, writeContractAsync]
  );
};

export default useCreateProposal;
