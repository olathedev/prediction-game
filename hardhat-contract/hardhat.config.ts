import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    coreTestnet: {
      url: "https://rpc.test.btcs.network", // Core Testnet RPC
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      coreTestnet: process.env.CORE_TESTNET_SCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "coreTestnet",
        chainId: 1115,
        urls: {
          apiURL: "https://scan.test.btcs.network/api",
          browserURL: "https://scan.test.btcs.network",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
