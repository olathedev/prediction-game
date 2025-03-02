import { ethers } from "hardhat";
import "dotenv/config";

const CONTRACT_ADDRESS = "0x9cb3D742b89a2b363f84417120AADe481207c0F2";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Interacting with contract as:", signer.address);

  const PredictionGame = await ethers.getContractFactory("PredictionGame");
  const contract = PredictionGame.attach(CONTRACT_ADDRESS);

  // Set Username
  const tx = await contract.setUsername("Alice");
  await tx.wait();
  console.log("Username set successfully!");

  // Create Question (Owner only)
  const questionTx = await contract.createQuestion(
    "What is Solidity?",
    ["A", "B", "C", "D"],
    1, // duration (1 hour)
    2, // resolutionWindow (2 hours)
    600 // timeLimit (10 minutes)
  );
  await questionTx.wait();
  console.log("Question created successfully!");

  // Fetch Player Details
  const playerDetails = await contract.getPlayerDetails(signer.address);
  console.log("Player Details:", playerDetails);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
