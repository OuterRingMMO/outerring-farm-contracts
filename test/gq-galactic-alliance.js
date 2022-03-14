const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, snapshot } = require("@openzeppelin/test-helpers");

describe("GQGalacticAlliance contract", function () {

  let deployer;
  let notDeployer;
  let user1;
  let user2;
  let user3;
  let user4;

  beforeEach(async function () {
    GQGalacticAlliance = await ethers.getContractFactory("GQGalacticAlliance");
    gqGalacticAlliance = await GQGalacticAlliance.deploy();
    [deployer, notDeployer, user1, user2, user3, user4] =
      await ethers.getSigners();
  });

  // HAPPY PATH
  describe("addToWhitelist", function () {
    it("...Should add an specific address to the white list AND emit an event", async function () {
      const snapshotTest = await snapshot();
      await angelPhase.addToWhitelist(addrToBeAllowed.address, '1000');

      expect(await angelPhase.addToWhitelist(addrToBeAllowed.address, '1000'));
      // Expect para probar emitAddressAdded()
      await expect(angelPhase.addToWhitelist(addrToBeAllowed.address, '1000'))
        .to.emit(angelPhase, "AddedToWhitelist")
        .withArgs(addrToBeAllowed.address, '1000');
      await snapshotTest.restore();
    });
  });

  describe("removeFromWhitelist", function () {
    it("...Should remove an specific address from the white list AND emit an event", async function () {
      const snapshotTest = await snapshot();
      await angelPhase.addToWhitelist(addrToBeDenied.address, '1000');
      await angelPhase.removeFromWhitelist(addrToBeDenied.address);

      expect(await angelPhase.addToWhitelist(addrToBeDenied.address, '1000'));
      await expect(angelPhase.removeFromWhitelist(addrToBeDenied.address))
        .to.emit(angelPhase, "AddressIsRemoved")
        .withArgs(addrToBeDenied.address);
      await snapshotTest.restore();
    });
  });

  describe("checkIfIsWhitelisted", function () {
    it("...Should return TRUE if the specific address is in the  whitelist and FALSE if an specific address is not in the whitelist ", async function () {
      const snapshotTest = await snapshot();
      await angelPhase.addToWhitelist(addrToBeAllowed.address, '1000');
      await angelPhase.addToWhitelist(addrToBeDenied.address, '1000');
      await angelPhase.removeFromWhitelist(addrToBeDenied.address);

      expect(await angelPhase.checkIfIsWhitelisted(addrToBeAllowed.address));
      expect(await angelPhase.checkIfIsWhitelisted(addrToBeDenied.address));
      await snapshotTest.restore();
    });
  });

  // UNHAPPY PATH
  describe("Not owner/addToWhitelist", function () {
    it("...Should return ERROR if msg.sender != owner tries to add an specific address to the white list ", async function () {
      const snapshotTest = await snapshot();
      await expect(
        angelPhase.connect(notDeployer).addToWhitelist(addrToBeAllowed.address, '1000')
      ).to.be.revertedWith("Ownable: caller is not the owner");
      await snapshotTest.restore();
    });
  });

  describe("Not owner/removeFromWhitelist", function () {
    it("...Should return ERROR if msg.sender != owner tries to remove an specific address to the white list ", async function () {
      const snapshotTest = await snapshot();
      await angelPhase.addToWhitelist(addrToBeAllowed.address, '1000');
      await expect(
        angelPhase
          .connect(notDeployer)
          .removeFromWhitelist(addrToBeAllowed.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
      await snapshotTest.restore();
    });
  });

  describe("Send tokens to invetors", function () {

    // UNHAPPY PATH :(
    it(".. Should revert if caller is not the owner", async function () {
      const snapshotTest = await snapshot();
      await expect(angelPhase.connect(notDeployer).sendTokensToInvestor(user1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
      await snapshotTest.restore();
    });

    it(".. Should revert if timestamp not reach the cliff limit", async function () {
      const snapshotTest = await snapshot();
      await expect(angelPhase.connect(deployer).sendTokensToInvestor(user1.address)
      ).to.be.revertedWith("Cliff not finished yet");
      await snapshotTest.restore();
    });

    it(".. Should revert if investor is not allowed", async function () {
      const snapshotTest = await snapshot();
      await time.increase(7776000000);
      await expect(angelPhase.connect(deployer).sendTokensToInvestor(user1.address)
      ).to.be.revertedWith("Investor is not allowed");
      await snapshotTest.restore();
    });

  });
});
