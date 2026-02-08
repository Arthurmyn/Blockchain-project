import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const token = await ethers.deployContract("CharityToken");
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("TOKEN_ADDRESS:", tokenAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
