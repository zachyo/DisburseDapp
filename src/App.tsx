import { useConnectors } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { Button } from "./components/ui/button";
import AppLayout from "./components/layout";
import ProposalCard from "./components/ProposalCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useChairPerson from "./hooks/useChairPerson";
import { Toaster } from "./components/ui/sonner";
import useTransferTokens from "./hooks/useTransferTokens";
import useGetContractBalance from "./hooks/useGetContractBalance";
import { formatEther } from "viem";
import useGetSingleProposal from "./hooks/useGetSingleProposal";
import useGetProposalCount from "./hooks/useGetProposalCount";
import useGetAllProposals from "./hooks/useGetAllProposals";

function App() {
  const connectors = useConnectors();
  const { proposals, isLoading } = useGetAllProposals();

  const activeProposals = proposals.filter(
    (proposal: any) => proposal.deadline * 1000 > Date.now()
  );
  const inActiveProposals = proposals.filter(
    (proposal: any) => proposal.deadline * 1000 < Date.now()
  );

  const chairperson = useChairPerson();
  const balance = useGetContractBalance();
  console.log(proposals)
  const { sendEth, isConfirming, isPending } = useTransferTokens();


  return (
    <>
      <div className="p-12 hidden">
        <h1 className="mb-4">Hello, Wagmi!</h1>
        <div className="connectors flex gap-8 justify-center hidden">
          {/* This uses wagmi directly and leaves the styling to you */}
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connector.connect()}
              className="w-fit flex gap-2"
            >
              <img src={connector?.icon} alt="" className="h-5 w-5" />
              {connector.name}
            </button>
          ))}
        </div>
      </div>
      {/* why are we passing chairperson here and not using the hook in the layout component? */}
      <AppLayout chairperson={chairperson}>
        <div className="flex w-full flex-col gap-6">
          <div className="text-center font-semibold text-2xl">
            Contract Balance : {formatEther(BigInt(balance ?? 0))} ETH
          </div>
          {isLoading ? (
            <span className="flex justify-center">Loading proposals...</span>
          ) : (
            <Tabs defaultValue="active" className=" w-full">
              <TabsList className="mx-auto w-full my-2">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">InActive</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mx-auto w-full">
                {activeProposals?.length === 0 ? (
                  <span className="flex justify-center">
                    No active proposals
                  </span>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-fit mx-auto">
                    {activeProposals?.map((item: any) => (
                      <ProposalCard {...item} handleVote={() => {}} />
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="inactive">
                {inActiveProposals?.length === 0 ? (
                  <span className="flex justify-center">
                    No inactive proposals
                  </span>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-fit mx-auto">
                    {inActiveProposals?.map((item: any) => (
                      <ProposalCard {...item} handleVote={() => {}} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
        <Button
          disabled={isPending || isConfirming}
          onClick={() => sendEth("9000")}
          className="bg-red-500 hidden"
        >
          Fund Contract
        </Button>
      </AppLayout>
      <Toaster />
    </>
  );
}

export default App;
