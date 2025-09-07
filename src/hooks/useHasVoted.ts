import { QUADRATIC_GOVERNACE_CONTRACT_ABI } from "@/config/abi";
import { useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";

const useHasVoted = (id: number) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await publicClient?.readContract({
        address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
        abi: QUADRATIC_GOVERNACE_CONTRACT_ABI,
        functionName: "hasVoted",
        // @ts-ignore
        args: [id, address],
      });
      setHasVoted(!!result);
    })();
  }, [publicClient]);

  // recompute the memoized value when one of the deps has changed.
  return useMemo(() => hasVoted, [hasVoted]);
};

export default useHasVoted;
