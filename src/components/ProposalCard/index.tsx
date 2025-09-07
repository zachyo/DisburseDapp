import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useHasVoted from "@/hooks/useHasVoted";
import useVote from "@/hooks/useVote";
import { shortenAddress } from "@/lib/utils";
import { format } from "date-fns";
import { formatEther } from "viem";

const ProposalCard = ({
  id,
  description,
  amount,
  recipient,
  voteCount,
  isExecuted,
  deadline,
  // handleVote,
}: {
  id: number;
  description: string;
  amount: number;
  recipient: string;
  voteCount: number;
  deadline: number;
  isExecuted: boolean;
  handleVote: () => void;
}) => {
  const hasVoted = useHasVoted(id);
  const voteProposal = useVote();
  return (
    <Card className="min-w-[350px] max-w-sm h-full flex flex-col justify-between">
      <div className="">
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center justify-between">
            <span>Proposal #{id}</span>
            <span>Vote Count: {voteCount}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Amount</span>
              <span>{formatEther(BigInt(amount))}</span>
            </div>
            <div className="flex justify-between">
              <span>Recipient</span>
              <span>{shortenAddress(recipient, 4)}</span>
            </div>
            <div className="flex justify-between">
              <span>Deadline</span>
              <span>{format(new Date(deadline * 1000), "dd MMMM yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span>Executed</span>
              <span>{isExecuted ? "Executed" : "Not Executed"}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex-col gap-2">
        <Button
          disabled={hasVoted || isExecuted}
          onClick={async () => await voteProposal(id)}
          variant="default"
          className="w-full"
        >
          Submit Vote
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProposalCard;
