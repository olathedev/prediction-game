import { createPublicClient, http } from 'viem'
import { coreDao } from 'viem/chains'
 
export const client = createPublicClient({ 
  chain: coreDao, 
  transport: http("https://rpc.test.btcs.network"), 
}) 

const blockNumber = await client.getBlockNumber()
console.log(blockNumber)