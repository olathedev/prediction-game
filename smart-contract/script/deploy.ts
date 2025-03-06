import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Deploy the contract
  const GuessGame = await ethers.getContractFactory("GuessGame");
  const guessGame = await GuessGame.deploy();

  await guessGame.waitForDeployment();

  console.log("GuessGame deployed to:", await guessGame.getAddress());
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
