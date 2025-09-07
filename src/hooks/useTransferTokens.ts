import { useCallback, useEffect } from "react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import useChairPerson from "./useChairPerson";
import { toast } from "sonner";
import { isAddressEqual, parseEther } from "viem";

const useTransferEth = () => {
  const { address } = useAccount();
  const chairperson = useChairPerson();
  const { data: hash, isPending, sendTransaction } = useSendTransaction();

  const sendEth = useCallback(
    (amount: string) => {
      if (!address) {
        toast.error("Not connected", {
          description: "Kindly connect your address",
        });
        return;
      }
      if (chairperson && !isAddressEqual(address, chairperson)) {
        toast.error("Unauthorized", {
          description: "This action is only available to the chairperson",
        });
        return;
      }

      sendTransaction({
        to: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
        value: parseEther(amount),
      });
    },
    [address, chairperson, sendTransaction]
  );

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transfer successful", {
        description: "You have successfully sent ETH.",
      });
    }
  }, [isConfirmed]);

  return {
    sendEth,
    isConfirming,
    isConfirmed,
    isPending,
    hash,
  };
};

export default useTransferEth;
