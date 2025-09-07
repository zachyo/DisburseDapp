import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { ReactNode } from "react";
import CreateProposal from "../CreateProposal";
import { useAccount } from "wagmi";
import { isAddressEqual } from "viem";

type AppLayoutProps = {
  children: ReactNode;
  chairperson?: address
};

const AppLayout: React.FC<AppLayoutProps> = ({ children, chairperson }) => {
  const { isConnected, address } = useAccount();

  
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div className="bg-slate-500">
        <header className="h-20 py-3 flex justify-between items-center mx-auto container">
          <p className="text-white capitalize font-medium text-2xl">
            WagmiConnect
          </p>
          <div className="flex items-center gap-4">
            <ConnectButton />
            {isConnected && address && chairperson && isAddressEqual(chairperson, address) && <CreateProposal />}
          </div>
        </header>
      </div>
      <main className="flex-1">{children}</main>
      <footer className=" bg-slate-500 text-white mt-5">
        <p className="text-center my-6">Wagmi Connect &copy; 2025</p>
      </footer>
    </div>
  );
};

export default AppLayout;
