const { expect } = require('chai')
const { ethers, deployments, getNamedAccounts } = require('hardhat')
const { time, snapshot } = require('@openzeppelin/test-helpers')

describe('GQGalacticAlliance', async () => {
  let deployer, fees, alice, bob, carol
  let gqGalacticAlliance, stakeToken, rewardToken1, rewardToken2;
  before(async () => {
    ;[deployer, fees, alice, bob, carol] = await getNamedAccounts();
  });

  describe("prueba", function () {
    it("should", async () => {
      await deployments.fixture(["GQGalacticAlliance", "StakeToken", "RewardToken1", "RewardToken2"]);
      const GQGalacticAlliance = await ethers.getContract("GQGalacticAlliance");
      const StakeToken = await ethers.getContract("StakeToken");
      const RewardToken1 = await ethers.getContract("RewardToken1");
      const RewardToken2 = await ethers.getContract("RewardToken2");
      console.log(RewardToken1.address);
    });
  })
})
