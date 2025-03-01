import { defineChain, getContract } from 'viem'
import { abi } from '../abi/Game.json'
import { client } from './viemClient'
 
const contractAddress = '0x45d3B4E6D50BFFb87CF5b1129aFc2955927EBf49'

export const contract = getContract({ address: contractAddress, abi, client })

export const coreDaoTestnet = defineChain({
    id: 1115,
    name: "Core DAO Testnet",
    network: "coredao-testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Core",
      symbol: "tCORE",
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.test.btcs.network"],
      },
      public: {
        http: ["https://rpc.test.btcs.network"],
      },
    },
    blockExplorers: {
      default: { name: "CoreDAO Explorer", url: "https://scan.test.btcs.network" },
    },
    testnet: true,
  });