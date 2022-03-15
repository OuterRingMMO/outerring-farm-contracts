import { expect } from "chai";
import { deployContract } from "ethereum-waffle";
import { deployments, ethers, waffle } from "hardhat";
import GQGalacticAlliance from "../artifacts/contracts/GQGalacticAlliance.sol/GQGalacticAlliance.json";

describe("GQGalacticAlliance", async () => {
  const [deployer, alice, carol, bob] = waffle.provider.getWallets();
  const setupTest = deployments.createFixture(async ({ deployments }) => {
    await deployments.fixture();
    return await deployContract(deployer, GQGalacticAlliance);
  });

  describe("Testing", async () => {
    it("should make anything", async () => {
      const gq = await setupTest();
      
    });
  });
});
