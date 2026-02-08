import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
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

  // CharityCrowdfunding must own CharityToken to mint proof-of-donation rewards
  const ownershipTx = await charityToken.transferOwnership(crowdfundingAddress);
  await ownershipTx.wait();
  console.log("CharityToken ownership transferred to CharityCrowdfunding");

  console.log("\nCopy these addresses to your frontend/js/web3.js file!");
  console.log("TOKEN_ADDRESS =", tokenAddress);
  console.log("CONTRACT_ADDRESS =", crowdfundingAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
