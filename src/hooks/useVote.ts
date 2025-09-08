import { useCallback } from "react";
import {
  useAccount,
  useWalletClient,
  useWriteContract,
  usePublicClient,
  // useReadContract,
} from "wagmi";
import {
  // GOVERNACE_ADDRESS_ABI,
  QUADRATIC_GOVERNACE_CONTRACT_ABI,
} from "@/config/abi";
import { toast } from "sonner";

const useVote = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const walletClient = useWalletClient();
  const publicClient = usePublicClient();

  // const res = useReadContract({
  //   abi: GOVERNACE_ADDRESS_ABI,
  //   address: import.meta.env.VITE_GOVERNACE_ADDRESS,
  //   functionName: "balanceOf",
  //   args: [import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT],
  // });

  // // const resultObject = JSON.parse(JSON.stringify(res));
  // console.log("resultObject: ", res.data);

  return useCallback(

    async (id: number) => {
      if (!address || !walletClient || !publicClient) {
        toast.error("Not connected", {
          description: "Kindly connect your wallet",
        });
        return;
      }

      const txHash = await writeContractAsync({
        address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
        abi: QUADRATIC_GOVERNACE_CONTRACT_ABI,
        functionName: "vote",
        // @ts-ignore
        args: [id],
      });

      const txReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      console.log("txHash: ", txHash, txReceipt);

      if (txReceipt.status === "success") {
        toast.success("Voted successfully", {
          description: "You have successfully voted",
        });
      }
    },
    [address, writeContractAsync]
  );
};

export default useVote;
