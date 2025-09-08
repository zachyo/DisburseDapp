import { formatLogToProposal } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";

const useGetAllProposals = () => {
  const publicClient = usePublicClient();
  const [proposals, setProposals] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!publicClient) return;

    async function getInitialProposals() {
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
      const mappedProposals = result
        ?.map(formatLogToProposal)
        .sort((a, b) => b.id - a.id);

      setProposals(mappedProposals);
      setIsLoading(false);
    }

    const unwatch = publicClient.watchEvent({
      address: import.meta.env.VITE_QUADRATIC_GOVERNACE_CONTRACT,
      event: parseAbiItem(
        "event ProposalCreated(uint indexed proposalId, string description, address recipient, uint amount, uint deadline)"
      ),
      onLogs: (newLogs) => {
        const newProposals = newLogs.map(formatLogToProposal);
        // Prepend new proposals to maintain descending sort order by ID
        setProposals((prev:any) => [...newProposals, ...prev]);
      },
    });

    getInitialProposals();

    return () => {
      unwatch();
    };
  }, [publicClient]);

  // recompute the memoized value when one of the deps has changed.
  return useMemo(() => ({ proposals, isLoading }), [proposals]);
};

export default useGetAllProposals;
