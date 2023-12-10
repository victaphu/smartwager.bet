export { }
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("StakeWiseRandom", function () {
  let stakeWiseRandom: any, vrfCoordinatorMock: any, stakeWiseServiceMock: any, owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    // Mock VRFCoordinator and IStakeWiseWagerService
    // ...
    const Vrf = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    vrfCoordinatorMock = await Vrf.deploy("100000000000000000", 1000000000);
    const tx = await vrfCoordinatorMock.createSubscription();
    const receipt = await tx.wait();

    await (await vrfCoordinatorMock.fundSubscription(1, "10000000000000000000")).wait();

    const swsm = await ethers.getContractFactory("MockStakeWiseWagerService");
    stakeWiseServiceMock = await swsm.deploy();

    // Deploy StakeWiseRandom with the mock addresses
    const StakeWiseRandom = await ethers.getContractFactory("StakeWiseRandom");
    stakeWiseRandom = await StakeWiseRandom.deploy(1, await vrfCoordinatorMock.getAddress(), "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc");

    // stakeWiseRandom.transferOwnership(await stakeWiseServiceMock.getAddress());

    vrfCoordinatorMock.addConsumer(1, await stakeWiseRandom.getAddress());

  });

  describe("requestResult", function () {
    it("should handle a valid request for random results ODD", async function () {
      const slot = await stakeWiseServiceMock.roundToNearestFiveMinutes();
      const gameIds = [1, 2, 3];

      await stakeWiseRandom.requestResult(slot, gameIds);

      expect(await stakeWiseServiceMock.gameIdMapping(1)).eq(0); // no value
      expect(await stakeWiseServiceMock.gameIdMapping(2)).eq(0); // no value
      expect(await stakeWiseServiceMock.gameIdMapping(3)).eq(0); // no value
      await stakeWiseRandom.transferOwnership(stakeWiseServiceMock);

      // run the random VRF
      await vrfCoordinatorMock.fulfillRandomWordsWithOverride(1, await stakeWiseRandom.getAddress(), [2]);

      // confirm our contract instances are updated
      expect(await stakeWiseServiceMock.gameIdMapping(1)).eq(1);
      expect(await stakeWiseServiceMock.gameIdMapping(2)).eq(1);
      expect(await stakeWiseServiceMock.gameIdMapping(3)).eq(1);
    });

    it("should handle a valid request for random results EVEN", async function () {
      const slot = await stakeWiseServiceMock.roundToNearestFiveMinutes();
      const gameIds = [1, 2, 3];

      await stakeWiseRandom.requestResult(slot, gameIds);

      expect(await stakeWiseServiceMock.gameIdMapping(1)).eq(0); // no value
      expect(await stakeWiseServiceMock.gameIdMapping(2)).eq(0); // no value
      expect(await stakeWiseServiceMock.gameIdMapping(3)).eq(0); // no value

      await stakeWiseRandom.transferOwnership(stakeWiseServiceMock);
      // run the random VRF
      await vrfCoordinatorMock.fulfillRandomWordsWithOverride(1, await stakeWiseRandom.getAddress(), [333]);

      // confirm our contract instances are updated
      expect(await stakeWiseServiceMock.gameIdMapping(1)).eq(2);
      expect(await stakeWiseServiceMock.gameIdMapping(2)).eq(2);
      expect(await stakeWiseServiceMock.gameIdMapping(3)).eq(2);
    });

    it("should revert on a duplicate request for the same timeslot", async function () {
      const slot = await stakeWiseServiceMock.roundToNearestFiveMinutes();
      const gameIds = [1, 2, 3];

      await stakeWiseRandom.requestResult(slot, gameIds);
      await expect(stakeWiseRandom.requestResult(slot, gameIds)).to.be.revertedWith("request already made");
    });

    it("should correctly handle multiple games for a single timeslot", async function () {
      const slot = await stakeWiseServiceMock.roundToNearestFiveMinutes();
      const gameIds = [1, 2, 3];

      const tx = await stakeWiseRandom.requestResult(slot, gameIds);
      const receipt = await tx.wait();
      // Verify the mapping for the timeslot includes all game IDs
      // ...

      const tx2 = await stakeWiseRandom.requestResult(123, [4, 5, 6]);
      const receipt2 = await tx2.wait();

      expect(await stakeWiseServiceMock.gameIdMapping(1)).eq(0);
      expect(await stakeWiseServiceMock.gameIdMapping(2)).eq(0);
      expect(await stakeWiseServiceMock.gameIdMapping(3)).eq(0);


      expect(await stakeWiseServiceMock.gameIdMapping(4)).eq(0);
      expect(await stakeWiseServiceMock.gameIdMapping(5)).eq(0);
      expect(await stakeWiseServiceMock.gameIdMapping(6)).eq(0);

      await stakeWiseRandom.transferOwnership(stakeWiseServiceMock);

      await vrfCoordinatorMock.fulfillRandomWordsWithOverride(1, await stakeWiseRandom.getAddress(), [333]);

      expect(await stakeWiseServiceMock.gameIdMapping(1)).eq(2);
      expect(await stakeWiseServiceMock.gameIdMapping(2)).eq(2);
      expect(await stakeWiseServiceMock.gameIdMapping(3)).eq(2);

      await vrfCoordinatorMock.fulfillRandomWordsWithOverride(2, await stakeWiseRandom.getAddress(), [334]);

      expect(await stakeWiseServiceMock.gameIdMapping(1)).eq(2);
      expect(await stakeWiseServiceMock.gameIdMapping(2)).eq(2);
      expect(await stakeWiseServiceMock.gameIdMapping(3)).eq(2);


      expect(await stakeWiseServiceMock.gameIdMapping(4)).eq(1);
      expect(await stakeWiseServiceMock.gameIdMapping(5)).eq(1);
      expect(await stakeWiseServiceMock.gameIdMapping(6)).eq(1);
    });
  });
});
