require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require('hardhat-deploy');
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  namedAccounts: {
    deployer: 0
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY1}`]
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/57d2eecbc0fd4f94b263eae83dd8ed93`,
      chainId: 3,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY1}`]
    },
    bscTestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      chainId: 97,
      gas: 2100000,
      gasPrice: 12000000000,
      accounts: [
        `0x${process.env.DEPLOYER_PRIVATE_KEY1}`,
        `0x${process.env.DEPLOYER_PRIVATE_KEY2}`,
        `0x${process.env.DEPLOYER_PRIVATE_KEY3}`
      ]
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      chainId: 80001,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY1}`]
    }
  },
  etherscan: {
    apiKey: {
      ropsten: process.env.ETHERSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY
    }
  }
};
