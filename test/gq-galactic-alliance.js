const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert, time, snapshot } = require("@openzeppelin/test-helpers");
const ether = require("@openzeppelin/test-helpers/src/ether");
const balance = require("@openzeppelin/test-helpers/src/balance");

const TOKEN1 = 1;
const TOKEN2 = 2;
const startBlock = 20;
const endBlock = 120;
const lockUpDuration = 30;
const withdrawFee = 500;

const mintingAmount = 1000;
const stakeTokenAmount = 100;
const rewardTokenAmount1 = 100;
const rewardTokenAmount2 = 50;

function fromWei(n) {
  return ethers.utils.formatUnits(n, 18);
}

function toWei(n) {
  return ethers.utils.parseEther(n);
}

describe("DEX", function () {

  let gqGalacticAlliance;
  let stakeToken;
  let rewardToken1;
  let rewardToken2;
  let snapshotTest;

  before(async function () {
    snapshotTest = await snapshot();
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
    await stakeToken.connect(alice).mint(alice.address, toWei(mintingAmount.toString()));
    await stakeToken.connect(alice).approve(gqGalacticAlliance.address, toWei(mintingAmount.toString()));
    await stakeToken.connect(bob).mint(bob.address, toWei(mintingAmount.toString()));
    await stakeToken.connect(bob).approve(gqGalacticAlliance.address, toWei(mintingAmount.toString()));
    await stakeToken.connect(carol).mint(carol.address, toWei(mintingAmount.toString()));
    await stakeToken.connect(carol).approve(gqGalacticAlliance.address, toWei(mintingAmount.toString()));

    await rewardToken1.connect(owner).mint(gqGalacticAlliance.address, toWei(rewardTokenAmount1.toString()));
    await rewardToken2.connect(owner).mint(gqGalacticAlliance.address, toWei(rewardTokenAmount2.toString()));
  });

  describe("Functionalities", () => {

    it("should deposit tokens correctly", async () => {
      await gqGalacticAlliance.connect(alice).deposit(toWei(stakeTokenAmount.toString()));
      const contractBalance = await stakeToken.balanceOf(gqGalacticAlliance.address);
      expect(contractBalance).to.equal(toWei("100"));
    });

    it("should calculate rewards to distribute correctly", async () => {
      
      const reward1Expected = rewardTokenAmount1 / (endBlock - startBlock);
      await gqGalacticAlliance.connect(owner).poolCalcRewardPerBlock(TOKEN1);
      const reward1Calculated = await gqGalacticAlliance.mapOfRewardPerBlock(TOKEN1);
      expect(reward1Calculated).to.equal(toWei(reward1Expected.toString()));

      const reward2Expected = rewardTokenAmount2 / (endBlock - startBlock);
      await gqGalacticAlliance.connect(owner).poolCalcRewardPerBlock(TOKEN2);
      const reward2Calculated = await gqGalacticAlliance.mapOfRewardPerBlock(TOKEN2);
      expect(reward2Calculated).to.equal(toWei(reward2Expected.toString()));
      
    });

    it("should calculate pending rewards correctly", async () => {
      await time.advanceBlockTo('20');
      // Advance one block for get one increment of the rewards
      await time.advanceBlock();
      const pendingReward1 = await gqGalacticAlliance.connect(alice).pendingReward(TOKEN1, alice.address);
      const pendingReward2 = await gqGalacticAlliance.connect(alice).pendingReward(TOKEN2, alice.address);
      const rewardPerBlock1 = await gqGalacticAlliance.connect(owner).mapOfRewardPerBlock(TOKEN1);
      const rewardPerBlock2 = await gqGalacticAlliance.connect(owner).mapOfRewardPerBlock(TOKEN2);
      expect(pendingReward1).to.equal(rewardPerBlock1);
      expect(pendingReward2).to.equal(rewardPerBlock2);
    });

    it("should extract a fee on withdraw", async () => {
      await gqGalacticAlliance.connect(alice).withdraw(toWei("100"));
      const balanceOf = await stakeToken.balanceOf(alice.address);
      const balanceExpected = mintingAmount - (stakeTokenAmount * (withdrawFee / 10000));
      expect(balanceOf).to.equal(toWei(balanceExpected.toString()));
      await snapshotTest.restore();
    });

  });
});
