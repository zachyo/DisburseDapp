import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "../DateTimePicker";
import useCreateProposal from "@/hooks/useCreateProposal";
import { parseEther } from "viem";
import useGetContractBalance from "@/hooks/useGetContractBalance";

const CreateProposal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [receipient, setReceipient] = useState<address>();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  // is it right to call balance here or inside the proposal contract?
  const balance = useGetContractBalance();
  const { createProposal, isPending, isSuccess } = useCreateProposal(balance);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      // Reset form fields after successful submission
      setDescription("");
      setReceipient(undefined);
      setAmount("");
      setDate(undefined);
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Create Proposal</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new Proposal</DialogTitle>
            <DialogDescription>
              Create a new proposla to be execusted once all requirements are
              attained
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="name"
                defaultValue=""
                value={description}
                placeholder="description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="receipient">Receipient</Label>
              <Input
                id="receipient"
                name="username"
                value={receipient}
                placeholder="receipient"
                onChange={(e) => setReceipient(e.target.value as address)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                name="amount"
                value={amount}
                placeholder="amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">Deadline</Label>
              <DateTimePicker date={date as Date} setDate={setDate} />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full disabled:opacity-40"
              onClick={() =>
                // console.log(date?.valueOf() / 1000)
                createProposal(
                  description,
                  receipient as address,
                  Number(parseEther(amount)),
                  (date as Date).valueOf() / 1000
                )
              }
            >
              {isPending ? "Creating..." : "Create Proposal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CreateProposal;
