import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Ensure the private key is available
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

// RPC URL from environment variables
const RPC_URL = process.env.RPC_URL || "https://sepolia.base.org";

// Optional: Etherscan API key for verification (commented out since it's commented in your .env)
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Base Sepolia testnet
    baseSepolia: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 84532, // Base Sepolia chain ID
    },
    // You can add more networks here as needed
  },
  // Uncomment when you want to use Etherscan verification
  // etherscan: {
  //   apiKey: {
  //     baseSepolia: ETHERSCAN_API_KEY,
  //   },
  //   customChains: [
  //     {
  //       network: "baseSepolia",
  //       chainId: 84532,
  //       urls: {
  //         apiURL: "https://api-sepolia.basescan.org/api",
  //         browserURL: "https://sepolia.basescan.org",
  //       },
  //     },
  //   ],
  // },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;