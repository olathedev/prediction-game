import React, { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, coreDao, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { coreDaoTestnet } from "../utils/Contract";

const config = getDefaultConfig({
  appName: "safelock",
  projectId: "1d26e3b9bc5a24bc32a6f92da8f54a85",
  chains: [coreDaoTestnet, coreDao, mainnet, sepolia, polygon, optimism, arbitrum, base],
  ssr: false,
});

const queryClient = new QueryClient();

const CustomRainbowKitProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#68399D",
            fontStack: "system",
            overlayBlur: "small",
            borderRadius: "large",
            
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default CustomRainbowKitProvider;
