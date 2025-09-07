import { QUADRATIC_GOVERNACE_CONTRACT_ABI } from "@/config/abi";
import { useEffect, useMemo, useState } from "react";
import { usePublicClient, useReadContract } from "wagmi";

const useGetSingleProposal = (id: number) => {
  const publicClient = usePublicClient();
  const [proposal, setProposal] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const res = useReadContract({
    abi: QUADRATIC_GOVERNACE_CONTRACT_ABI,
    address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
    functionName: "proposals",
  });

  const resultObject = JSON.parse(JSON.stringify(res));

  console.log("resultObject: ", resultObject.data);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await publicClient?.readContract({
        address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
        abi: QUADRATIC_GOVERNACE_CONTRACT_ABI,
        functionName: "proposals",
        args: [BigInt(id - 1)],
      });

      setProposal({
        id: id,
        description: result?.[0],
        amount: result?.[2],
        receipient: result?.[1],
        voteCount: result?.[3],
        isExecuted: result?.[5],
        deadline: result?.[4],
      });
      setIsLoading(false);
    })();
  }, [publicClient]);

  // recompute the memoized value when one of the deps has changed.
  return useMemo(() => ({ proposal, isLoading }), [proposal]);
};

export default useGetSingleProposal;
