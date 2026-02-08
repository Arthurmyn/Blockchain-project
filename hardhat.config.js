<<<<<<< HEAD:hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
=======
import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";

export default defineConfig({
  plugins: [hardhatEthers],
>>>>>>> 0b2b66b (feat(hardhat): add CharityToken deploy/mint scripts and ethers plugin setup):hardhat.config.ts
  solidity: {
    version: "0.8.30",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
<<<<<<< HEAD:hardhat.config.js
};
=======
});
>>>>>>> 0b2b66b (feat(hardhat): add CharityToken deploy/mint scripts and ethers plugin setup):hardhat.config.ts
