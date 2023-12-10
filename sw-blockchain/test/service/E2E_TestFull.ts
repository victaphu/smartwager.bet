// Full end-to-end test
// 1. user 1 bridge nft
// 2. user 2 bridge nft
// 3. user 1 wage nft
// 4. user 2 accept wager
// 5. wage happen and user 2 win
// 6. user 2 withdraw the nfts
// 7. user 2 redeem the NFTs back to main chain

export { }
const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("E2E_TestFull", function () {
  let owner: any, user1: any, user2: any;

  // escrow service and claim notes
  let linkToken: { getAddress: () => any; };
  let claimNote721_1: any;
  let escrowService_1: any;
  let routerClientMock: any;
  let claimNote721_2: any;
  let escrowService_2: any;

  let sample721: any;
  let provider: any;

  // stakewise component
  let wagerService: any, addr1: any;
  const gameId = 1; // Example game ID for testing
  let forwarder: any;
  const fifteenMinutes = 15 * 60; // 15 minutes in seconds
  let swnft: any;
  let stakeWiseRandom: any;
  let vrfCoordinatorMock: any;

  const gameData = {
    description: "Champions League Final",
    name: "CL Final 2023",
    url: "https://example.com/games/cl-final-2023",
    image: "https://example.com/images/cl-final-2023.jpg",
    eventId: 1, // Unique identifier for the game
    eventDate: Math.floor(Date.now() / 1000) + fifteenMinutes, // Unix timestamp, e.g., 24 hours from now
    datasource: "https://api.example.com/games/cl-final-2023",
    active: true
  };


  beforeEach(async function () {
    // Deploy mock contracts and ChainlinkTokenEscrowService
    [owner, user1, user2, forwarder] = await ethers.getSigners();

    const StakeWiseWhitelistNFT = await ethers.getContractFactory("StakeWiseWhitelistNFT");
    const whitelist = await StakeWiseWhitelistNFT.deploy();

    provider = ethers.provider;

    const RouterClientMock = await ethers.getContractFactory("RouterClientMock_Pipe");
    routerClientMock = await RouterClientMock.deploy();

    const LinkToken = await ethers.getContractFactory("MockLink");
    linkToken = await LinkToken.deploy(1000000);

    const ClaimNote721 = await ethers.getContractFactory("ClaimNote721");
    claimNote721_1 = await ClaimNote721.deploy();
    claimNote721_2 = await ClaimNote721.deploy();

    const SampleERC721 = await ethers.getContractFactory("SampleERC721");
    sample721 = await SampleERC721.deploy();
    const ChainlinkTokenEscrowService = await ethers.getContractFactory(
      "ChainlinkTokenEscrowServiceOverride"
    );
    escrowService_1 = await ChainlinkTokenEscrowService.deploy(
      await routerClientMock.getAddress(),
      await linkToken.getAddress(),
      await claimNote721_1.getAddress(),
      await whitelist.getAddress()
    );

    await claimNote721_1.transferOwnership(await escrowService_1.getAddress());

    escrowService_2 = await ChainlinkTokenEscrowService.deploy(
      await routerClientMock.getAddress(),
      await linkToken.getAddress(),
      await claimNote721_2.getAddress(),
      await whitelist.getAddress()
    );

    await claimNote721_2.transferOwnership(await escrowService_2.getAddress());

    await routerClientMock.register(1, await escrowService_1.getAddress());
    await routerClientMock.register(123, await escrowService_2.getAddress());

    await whitelist.addWhitelistContract(await sample721.getAddress());
    await whitelist.addWhitelistContract(await claimNote721_1.getAddress());
    await whitelist.addWhitelistContract(await claimNote721_2.getAddress());

    // Stakewise platform
    const SWNFT = await ethers.getContractFactory("SWNFT");
    swnft = await SWNFT.deploy(await whitelist.getAddress());

    const Vrf = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    vrfCoordinatorMock = await Vrf.deploy("100000000000000000", 1000000000);
    const tx = await vrfCoordinatorMock.createSubscription();
    const receipt = await tx.wait();

    await (await vrfCoordinatorMock.fundSubscription(1, "10000000000000000000")).wait();

    // // Deploy StakeWiseRandom with the mock addresses
    const StakeWiseRandom = await ethers.getContractFactory("StakeWiseRandom");
    stakeWiseRandom = await StakeWiseRandom.deploy(1, await vrfCoordinatorMock.getAddress(), "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc");
    await vrfCoordinatorMock.addConsumer(1, await stakeWiseRandom.getAddress());

    // Deploy stake wise wager service
    const StakeWiseWagerService = await ethers.getContractFactory("StakeWiseWagerService");
    wagerService = await StakeWiseWagerService.deploy(await swnft.getAddress(), await stakeWiseRandom.getAddress());
    await swnft.transferOwnership(await wagerService.getAddress());
    await wagerService.setForwarder(forwarder.address);
    await stakeWiseRandom.transferOwnership(await wagerService.getAddress());

    await escrowService_1.updateCTESMapping(123, await escrowService_2.getAddress());
    await escrowService_2.updateCTESMapping(123, await escrowService_1.getAddress());

    await escrowService_2.updateCTESMapping(1, await escrowService_1.getAddress());
  });

  it("an end-to-end test from minting to bridge, to wager back to original chain to redeem", async function () {
    const tokenId = 1;
    const sender = owner.address;
    const sourceChainSelector = 123;
    const payFeesIn = 0; // Pay fees in native currency

    // Mock the IRouterClient's getFee function
    const fee = 100; // Replace with the desired fee amount

    // Mint a sample ERC721 token
    await sample721.connect(user1).mintToken();
    await sample721.connect(user2).mintToken();

    // Get the encoded CTESMessage for the transfer
    const encoded = await escrowService_1.getEncoded(sourceChainSelector, payFeesIn);
    // Get the estimated fees for the transfer
    const fees = await escrowService_1.getFeeEstimate(await sample721.getAddress(), sender, 1, encoded);

    await (await user1.sendTransaction({ to: await escrowService_1.getAddress(), value: fees })).wait();
    await (await user2.sendTransaction({ to: await escrowService_1.getAddress(), value: fees })).wait();

    expect(await claimNote721_2.balanceOf(user1.address)).eq(0);
    expect(await claimNote721_2.balanceOf(user2.address)).eq(0);

    // Transfer the ERC721 token to the escrowService
    await sample721.connect(user1)['safeTransferFrom(address,address,uint256,bytes)'](user1.address, await escrowService_1.getAddress(), tokenId, encoded);
    await sample721.connect(user2)['safeTransferFrom(address,address,uint256,bytes)'](user2.address, await escrowService_1.getAddress(), tokenId + 1, encoded);

    // Ensure that the routerClientMock has received the fees
    expect(await provider.getBalance(await routerClientMock.getAddress())).to.be.eq(BigInt("200000000000000000"));
    expect(await sample721.balanceOf(await escrowService_1.getAddress())).eq(2);

    // confirm there is a claimable note on the destination chain
    expect(await claimNote721_2.balanceOf(user1.address)).eq(1);
    expect(await claimNote721_1.balanceOf(user1.address)).eq(0);
    expect(await claimNote721_2.balanceOf(user2.address)).eq(1);
    expect(await claimNote721_1.balanceOf(user2.address)).eq(0);

    // lets set up a game, and have user1 and user2 play; with teh winner being user1

    // setup the game
    await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });

    // setup the wager (user1)
    await expect(wagerService.connect(user1).createWager(gameData.eventId))
      .to.emit(wagerService, "WagerCreated") // Assuming you have a WagerCreated event
      .withArgs(gameData.eventId, user1.address);

    expect(await swnft.ownerOf(1)).eq(user1.address);
    const swnftAddress = await swnft.getAddress();
    await claimNote721_2.connect(user1)['safeTransferFrom(address,address,uint256,bytes)'](user1.address, swnftAddress, 0, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
    await claimNote721_2.connect(user2)['safeTransferFrom(address,address,uint256,bytes)'](user2.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

    // NFT should be held by swnft now
    // verify the balance
    expect(await claimNote721_2.ownerOf(0)).eq(swnftAddress);
    expect(await claimNote721_2.ownerOf(1)).eq(swnftAddress);
    expect(await claimNote721_2.balanceOf(user1.address)).eq(0);
    expect(await claimNote721_2.balanceOf(user2.address)).eq(0);
    const game = await swnft.getResult(1);
    expect(game.player1).eq(user1.address);
    expect(game.player2).eq(user2.address);
    expect(game.p1Position).eq(1);
    expect(game.p2Position).eq(2);
    expect(game.p1TokenId).eq(0);
    expect(game.p2TokenId).eq(1);

    // accept the wager!
    await swnft.connect(user1).accept(1);

    // Lets run the game and generate 
    await ethers.provider.send("evm_increaseTime", [fifteenMinutes]);
    await ethers.provider.send("evm_mine");

    await expect(wagerService.connect(forwarder).performUpkeep("0x"))
      .to.emit(wagerService, "UpkeepPerformed"); // Assuming an event is emitted

    // check stakewise random

    const currentTime = (await ethers.provider.getBlock('latest')).timestamp;
    const gameEventTime = currentTime; // 15 minutes from now
    expect((await stakeWiseRandom.getGamesByTimestamp(await wagerService.roundToNearestFifteenMinutes(gameEventTime)))[0]).eq(BigInt(1));

    // generate random number and then check results
    await vrfCoordinatorMock.fulfillRandomWordsWithOverride(1, await stakeWiseRandom.getAddress(), [1]);

    expect(await swnft.stakeWiseResults(1)).eq(2);
    await expect(swnft.connect(user1).claim(1)).to.be.revertedWith('not winner');
    await swnft.connect(user2).claim(1);

    // lets confirm user 2 now has all the tokens (we won!);
    expect(await claimNote721_2.balanceOf(user1.address)).eq(0);
    expect(await claimNote721_2.balanceOf(user2.address)).eq(2);
        
    // lets redeem the token; first make sure we don't own the token yet
    expect(await  sample721.balanceOf(user2.address)).eq(0);
    expect(await  sample721.balanceOf(user1.address)).eq(0);
    
    // we want to use CCIP back to the main chain, get the fees then transfer
    const fees2 = await escrowService_2.getFeeEstimate(await sample721.getAddress(), sender, 1, encoded);    
    await (await user2.sendTransaction({ to: await escrowService_2.getAddress(), value: BigInt("200000000000000000") })).wait();

    // await claimNote721_2.connect(user2).safeTransferFrom(user2.address, await escrowService_2.getAddress(), 0);
    // await claimNote721_2.connect(user2).safeTransferFrom(user2.address, await escrowService_2.getAddress(), 1);

    await claimNote721_2.connect(user2)['safeTransferFrom(address,address,uint256,bytes)'](user2.address, await escrowService_2.getAddress(), 0, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
    await claimNote721_2.connect(user2)['safeTransferFrom(address,address,uint256,bytes)'](user2.address, await escrowService_2.getAddress(), 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));


    // confirm that the token is now in user2 
    expect(await  sample721.balanceOf(user2.address)).eq(2);
    expect(await  sample721.balanceOf(user1.address)).eq(0);
  });
});
