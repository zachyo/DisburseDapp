import { QUADRATIC_GOVERNACE_CONTRACT_ABI } from "@/config/abi";
import { useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";

const useGetProposalCount = () => {
  const publicClient = usePublicClient();
  const [proposalCount, setProposalCount] = useState<number>();

  useEffect(() => {
    (async () => {
      const result = await publicClient?.readContract({
        address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
        abi: QUADRATIC_GOVERNACE_CONTRACT_ABI,
        functionName: "getProposalCount",        
      });
      setProposalCount(Number(result));
    })();
  }, [publicClient]);

  // recompute the memoized value when one of the deps has changed.
  return useMemo(() => proposalCount, [proposalCount]);
};

export default useGetProposalCount;
