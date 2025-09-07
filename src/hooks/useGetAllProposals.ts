import { useEffect, useMemo, useState } from "react";
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";

const useGetAllProposals = () => {
  const publicClient = usePublicClient();
  const [proposals, setProposals] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await publicClient?.getLogs({
        event: parseAbiItem(
          "event ProposalCreated(uint indexed proposalId, string description, address recipient, uint amount, uint deadline)"
        ),
        address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
        fromBlock: 9147045n,
        toBlock: "latest",
      });
      // console.log(res)

      // Map logs to proposal objects
      const mappedProposals = result?.map((log) => ({
        id: Number(log.args.proposalId), 
        description: log.args.description,
        recipient: log.args.recipient,
        amount: Number(log.args.amount), 
        deadline: Number(log.args.deadline),
      }));

      setProposals(mappedProposals);
      setIsLoading(false);
    })();
  }, [publicClient]);

  // recompute the memoized value when one of the deps has changed.
  return useMemo(() => ({ proposals, isLoading }), [proposals]);
};

export default useGetAllProposals;
