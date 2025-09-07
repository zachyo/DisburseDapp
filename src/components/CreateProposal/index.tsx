import React, { useState } from "react";
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
  const [description, setDescription] = useState("");
  const [receipient, setReceipient] = useState<address>();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  // is it right to call balance here or inside the proposal contract?
  const balance = useGetContractBalance();
  const createPropsal = useCreateProposal(balance);

  return (
      <Dialog>
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
                className="w-full disabled:opacity-40"
                onClick={() =>
                  createPropsal(
                    description,
                    receipient as address,
                    Number(parseEther(amount)),
                    (date as Date).valueOf() / 1000
                  )
                }
              >
                Create Propsal
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
  );
};

export default CreateProposal;
