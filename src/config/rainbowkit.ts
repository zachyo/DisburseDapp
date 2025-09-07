import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "DAO App",
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  chains: [sepolia],
  
  ssr: true, // If your dApp uses server side rendering (SSR)
});
