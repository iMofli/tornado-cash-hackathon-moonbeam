import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.7.0",
  networks: {
    hardhat: {},
    moonbaseAlpha: {
      url: 'https://rpc.api.moonbase.moonbeam.network', // Insert your RPC URL here
      chainId: 1287, // (hex: 0x507),
      accounts: [process.env.PRIVATE_KEY],
      timeout: 1500000,
    }
  },
  etherscan: {
    apiKey: {
      moonbaseAlpha: process.env.MOONBASE_API_KEY, // Moonbeam Moonscan API Key
    },
  },
};

export default config;
