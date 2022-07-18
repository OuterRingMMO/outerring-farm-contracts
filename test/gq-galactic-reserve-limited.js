const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert, time, snapshot } = require("@openzeppelin/test-helpers");
const ether = require("@openzeppelin/test-helpers/src/ether");
const balance = require("@openzeppelin/test-helpers/src/balance");
const { parseUnits } = require("ethers/lib/utils");

const startBlock = 20;
const endBlock = 120;
const lockUpDuration = 30;
const withdrawFee = 500;
const maxStakeAmount = parseUnits("49000", "ether");
const mintingAmount = parseUnits("1000000", "ether");

function fromWei(n) {
  return ethers.utils.formatUnits(n, 18);
}

function toWei(n) {
  return ethers.utils.parseEther(n);
}

describe("DEX", function () {

  let gqGalacticReserve;
  let stakeToken;
  let rewardToken;
  let rewardToken2;
  let snapshotTest;

  before(async function () {
    snapshotTest = await snapshot();
    [owner, feer, alice, bob, carol] = await ethers.getSigners();
    gqGalacticReserve = await ethers.getContractAt("GQGalacticReserveLimited", "");
    stakeToken = await ethers.getContractAt("StakeToken", "");

    rewardToken = await ethers.getContractAt("RewardToken", "");

    await stakeToken.connect(alice).mint(alice.address, mintingAmount);
    await stakeToken.connect(alice).approve(gqGalacticReserve.address, mintingAmount);
    await stakeToken.connect(bob).mint(bob.address, mintingAmount);
    await stakeToken.connect(bob).approve(gqGalacticReserve.address, mintingAmount);
    await stakeToken.connect(carol).mint(carol.address, mintingAmount);
    await stakeToken.connect(carol).approve(gqGalacticReserve.address, mintingAmount);

    await rewardToken.connect(owner).mint(gqGalacticReserve.address, mintingAmount);
  });

  describe("Functionalities", () => {

    it("should deposit tokens correctly", async () => {
      await gqGalacticReserve.connect(alice).deposit(toWei(stakeTokenAmount.toString()));
      const contractBalance = await stakeToken.balanceOf(gqGalacticReserve.address);
      expect(contractBalance).to.equal(toWei("100"));
    });

    it("should calculate rewards to distribute correctly", async () => {

      const reward1Expected = rewardTokenAmount1 / (endBlock - startBlock);
      await gqGalacticReserve.connect(owner).poolCalcRewardPerBlock(TOKEN1);
      const reward1Calculated = await gqGalacticReserve.mapOfRewardPerBlock(TOKEN1);
      expect(reward1Calculated).to.equal(toWei(reward1Expected.toString()));

      const reward2Expected = rewardTokenAmount2 / (endBlock - startBlock);
      await gqGalacticReserve.connect(owner).poolCalcRewardPerBlock(TOKEN2);
      const reward2Calculated = await gqGalacticReserve.mapOfRewardPerBlock(TOKEN2);
      expect(reward2Calculated).to.equal(toWei(reward2Expected.toString()));

    });

    it("should calculate pending rewards correctly", async () => {
      await time.advanceBlockTo('20');
      // Advance one block for get one increment of the rewards
      await time.advanceBlock();
      const pendingReward1 = await gqGalacticReserve.connect(alice).pendingReward(TOKEN1, alice.address);
      const pendingReward2 = await gqGalacticReserve.connect(alice).pendingReward(TOKEN2, alice.address);
      const rewardPerBlock1 = await gqGalacticReserve.connect(owner).mapOfRewardPerBlock(TOKEN1);
      const rewardPerBlock2 = await gqGalacticReserve.connect(owner).mapOfRewardPerBlock(TOKEN2);
      expect(pendingReward1).to.equal(rewardPerBlock1);
      expect(pendingReward2).to.equal(rewardPerBlock2);
    });

    it("should extract a fee on withdraw", async () => {
      await gqGalacticReserve.connect(alice).withdraw(toWei("100"));
      const balanceOf = await stakeToken.balanceOf(alice.address);
      const balanceExpected = mintingAmount - (stakeTokenAmount * (withdrawFee / 10000));
      expect(balanceOf).to.equal(toWei(balanceExpected.toString()));
      await snapshotTest.restore();
    });

  });
});
