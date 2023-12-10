import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  networks: {
    hardhat: {

    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 80001
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY!}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY!],
      chainId: 11155111
    }
  },
  solidity: "0.8.20",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API!
  }
};

export default config;
