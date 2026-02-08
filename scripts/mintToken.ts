import { network } from "hardhat";
import { isAddress } from "ethers";

async function main() {
  const tokenAddress = process.env.TOKEN_ADDRESS;
  const toAddress = process.env.TO;
  const amount = process.env.AMOUNT ?? "100";

  if (!tokenAddress) {
    throw new Error("TOKEN_ADDRESS is required.");
  }

  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();
  const recipient = toAddress ?? deployer.address;

  if (!isAddress(tokenAddress)) {
    throw new Error("TOKEN_ADDRESS must be a full 0x... address");
  }

  if (!isAddress(recipient)) {
    throw new Error("TO must be a full 0x... address");
  }

  const token = await ethers.getContractAt("CharityToken", tokenAddress, deployer);
  const tx = await token.mint(recipient, ethers.parseUnits(amount, 18));
  await tx.wait();

  console.log(`Minted ${amount} CRT to ${recipient}`);
  console.log("Tx hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
