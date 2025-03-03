import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with address:", deployer.address);

  const PredictionGame = await ethers.getContractFactory("PredictionGame");
  const predictionGame = await PredictionGame.deploy();

  console.log("PredictionGame deployed at:", await predictionGame.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
