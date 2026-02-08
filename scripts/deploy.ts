import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy CharityToken (Reward Token)
  const CharityToken = await ethers.getContractFactory("CharityToken");
  const charityToken = await CharityToken.deploy(); 
  await charityToken.waitForDeployment();
  const tokenAddress = await charityToken.getAddress();
  console.log("CharityToken deployed to:", tokenAddress);

  // 2. Deploy CharityCrowdfunding
  const CharityCrowdfunding = await ethers.getContractFactory("CharityCrowdfunding");
  const charityCrowdfunding = await CharityCrowdfunding.deploy(tokenAddress);
  await charityCrowdfunding.waitForDeployment();
  const crowdfundingAddress = await charityCrowdfunding.getAddress();
  console.log("CharityCrowdfunding deployed to:", crowdfundingAddress);

  console.log("\nCopy these addresses to your frontend/js/web3.js file!");
  console.log("CONTRACT_ADDRESS =", crowdfundingAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
