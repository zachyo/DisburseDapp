import { createConfig, http } from "wagmi";
// import { injected } from 'wagmi/connectors'
import { mainnet, sepolia } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
