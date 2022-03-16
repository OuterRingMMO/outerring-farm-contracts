const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert, time, snapshot } = require("@openzeppelin/test-helpers");
const ether = require("@openzeppelin/test-helpers/src/ether");

const TOKEN1 = 1;
const TOKEN2 = 2;
const startBlock = 20;
const endBlock = 120;
const lockUpDuration = 30;
const withdrawFee = 500;

function fromWei(n) {
  return ethers.utils.formatUnits(n, 18);
}

function toWei(n) {
  return ethers.utils.parseEther(n);
}

describe("DEX", function () {

  let GQGalacticAlliance;
  let StakeToken;
  let RewardToken;

  before(async function () {

    [owner, feer, alice, bob, carol] = await ethers.getSigners();
    gqGalacticAlliance = await ethers.getContractAt("GQGalacticAlliance", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
    stakeToken = await ethers.getContractAt("StakeToken", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");

    rewardToken1 = await ethers.getContractAt("RewardToken", "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");
    rewardToken2 = await ethers.getContractAt("RewardToken", "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707");

    const isInitialized = await gqGalacticAlliance.isInitialized();
    if (!isInitialized) {
      await gqGalacticAlliance.initialize(
        stakeToken.address,
        rewardToken1.address,
        rewardToken2.address,
        startBlock,
        endBlock,
        lockUpDuration,
        withdrawFee,
        feer.address
      );
    }
    await stakeToken.connect(alice).mint(alice.address, toWei("1000"));
    await stakeToken.connect(alice).approve(gqGalacticAlliance.address, toWei("1000"));
    await rewardToken1.connect(owner).mint(gqGalacticAlliance.address, toWei("100"));
    await rewardToken2.connect(owner).mint(gqGalacticAlliance.address, toWei("50"));


  });

  describe("Functionalities", () => {
    it("should deposit tokens correctly", async () => {
      await gqGalacticAlliance.connect(alice).deposit(toWei("100"));
      const contractBalance = await stakeToken.balanceOf(gqGalacticAlliance.address);
      await expect(contractBalance).to.equal(toWei("100"));
    });

    it("should calculate reward correctly for reward token1", async () => {
      console.log(await gqGalacticAlliance.owner());
      await gqGalacticAlliance.connect(owner).poolCalcRewardPerBlock(TOKEN1);
    });
  });
});
