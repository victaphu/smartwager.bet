export { }
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakeWiseWhitelistNFT", function () {
  let whitelist: any, owner: any, nonOwner: any, testAddress: any;

  beforeEach(async function () {
    // Deploy the contract and get signers
    // ...

    [owner, nonOwner, testAddress] = await ethers.getSigners();
    const StakeWiseWhitelistNFT = await ethers.getContractFactory("StakeWiseWhitelistNFT")
    whitelist = await StakeWiseWhitelistNFT.deploy();
  });

  describe("addWhitelistContract", function () {
    it("allows the owner to add a contract to the whitelist", async function () {
      await whitelist.connect(owner).addWhitelistContract(testAddress.address);
      expect(await whitelist.isWhitelisted(testAddress.address)).to.equal(true);
    });

    it("does not allow a non-owner to add a contract to the whitelist", async function () {
      await expect(whitelist.connect(nonOwner).addWhitelistContract(testAddress.address)).to.be.reverted;
    });

    // Additional tests...
  });
  describe("removeWhiteListContract", function () {
    it("allows the owner to remove a contract from the whitelist", async function () {
      // First, add an address to the whitelist
      await whitelist.connect(owner).addWhitelistContract(testAddress.address);

      // Then, remove the same address
      await whitelist.connect(owner).removeWhiteListContract(testAddress.address);

      // Verify that the address is no longer whitelisted
      expect(await whitelist.isWhitelisted(testAddress.address)).to.equal(false);
    });

    it("does not allow a non-owner to remove a contract from the whitelist", async function () {
      // First, add an address to the whitelist by the owner
      await whitelist.connect(owner).addWhitelistContract(testAddress.address);

      // Attempt to remove the address by a non-owner
      await expect(whitelist.connect(nonOwner).removeWhiteListContract(testAddress.address)).to.be.revertedWithCustomError(whitelist, "OwnableUnauthorizedAccount");
    });

    it("handles removal of a non-existent address gracefully", async function () {
      // Attempt to remove an address that was never added
      await whitelist.connect(owner).removeWhiteListContract(testAddress.address);

      // Verify that the contract state remains unaffected
      expect(await whitelist.isWhitelisted(testAddress.address)).to.equal(false);
    });
  });

  describe("isWhitelisted", function () {
    it("returns true for an address that is whitelisted", async function () {
      // Add an address to the whitelist
      await whitelist.connect(owner).addWhitelistContract(testAddress.address);

      // Verify that isWhitelisted returns true
      expect(await whitelist.isWhitelisted(testAddress.address)).to.equal(true);
    });

    it("returns false for an address that is not whitelisted", async function () {
      // Verify that isWhitelisted returns false for a random address
      expect(await whitelist.isWhitelisted(nonOwner.address)).to.equal(false);
    });

    it("returns false for an address that was removed from the whitelist", async function () {
      // Add then remove the address from the whitelist
      await whitelist.connect(owner).addWhitelistContract(testAddress.address);
      await whitelist.connect(owner).removeWhiteListContract(testAddress.address);

      // Verify that isWhitelisted returns false
      expect(await whitelist.isWhitelisted(testAddress.address)).to.equal(false);
    });
  });
});
