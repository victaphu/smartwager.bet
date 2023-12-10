export {} 
const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("E2E_ChainlinkTokenEscrowService", function () {
  let owner: any, user1: any, user2: any;
  let linkToken: { getAddress: () => any; };
  let claimNote721_1: any;
  let escrowService_1: any;
  let routerClientMock: any;
  let claimNote721_2: any;
  let escrowService_2: any;
  
  let sample721: any;
  let provider: any;

  beforeEach(async function () {
    // Deploy mock contracts and ChainlinkTokenEscrowService
    [owner, user1, user2] = await ethers.getSigners();

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
  });

  it("should allow e2e transfer between simulated escrow services and redemption of note", async function () {
    const tokenId = 1;
    const sender = owner.address;
    const sourceChainSelector = 123;
    const payFeesIn = 0; // Pay fees in native currency

    // Mock the IRouterClient's getFee function
    const fee = 100; // Replace with the desired fee amount

    // Mint a sample ERC721 token
    await sample721.mintToken()

    // Attempt to transfer the token without providing CTESMessage as data
    await expect(sample721['safeTransferFrom(address,address,uint256)'](sender, await escrowService_1.getAddress(), tokenId))
      .to.be.revertedWith('Invalid data - escrow needs CTESMessage as data');

    // Get the encoded CTESMessage for the transfer
    const encoded = await escrowService_1.getEncoded(sourceChainSelector, payFeesIn);

    // Attempt to transfer the token without depositing enough fees
    await expect(sample721['safeTransferFrom(address,address,uint256,bytes)'](sender, await escrowService_1.getAddress(), tokenId, encoded))
      .to.be.revertedWith('Insufficient deposit');

    // Get the estimated fees for the transfer
    const fees = await escrowService_1.getFeeEstimate(await sample721.getAddress(), sender, 1, encoded);

    // Ensure the routerClientMock has no balance before the transfer
    expect(await provider.getBalance(await routerClientMock.getAddress())).to.be.eq(0);

    // Send Ether to the escrowService to pay for the token transfer
    const tx = await owner.sendTransaction({
      to: await escrowService_1.getAddress(),
      value: fees
    })

    // Wait for the transaction to be mined
    await tx.wait();

    expect(await claimNote721_2.balanceOf(sender)).eq(0);
    expect(await sample721.balanceOf(await escrowService_1.getAddress())).eq(0);
    
    // Transfer the ERC721 token to the escrowService
    await sample721['safeTransferFrom(address,address,uint256,bytes)'](sender, await escrowService_1.getAddress(), tokenId, encoded);

    // Ensure that the routerClientMock has received the fees
    expect(await provider.getBalance(await routerClientMock.getAddress())).to.be.eq(fees);
    expect(await sample721.balanceOf(await escrowService_1.getAddress())).eq(1);

    // confirm there is a claimable note on the destination chain
    expect(await claimNote721_2.balanceOf(sender)).eq(1);
    expect(await claimNote721_1.balanceOf(sender)).eq(0);
    
    // lets now transfer back to the escrowService_2
    // just need to do safe transfer
    const tx2 = await owner.sendTransaction({
      to: await escrowService_2.getAddress(),
      value: await escrowService_2.getFeeEstimateForClaim(sender, 0)
    })

    // Wait for the transaction to be mined
    await tx2.wait();

    console.log(await claimNote721_2.findNote(0), await escrowService_1.getAddress());
    await claimNote721_2.safeTransferFrom(sender, await escrowService_2.getAddress(), 0);
    
    expect(await sample721.ownerOf(1)).eq(sender);
    expect(await claimNote721_1.balanceOf(sender)).eq(0);
    expect(await claimNote721_1.balanceOf(await escrowService_1.getAddress())).eq(0);
    expect(await claimNote721_1.balanceOf(await escrowService_2.getAddress())).eq(0);

    expect(await claimNote721_2.balanceOf(sender)).eq(0);
    expect(await claimNote721_2.balanceOf(await escrowService_1.getAddress())).eq(0);
    expect(await claimNote721_2.balanceOf(await escrowService_2.getAddress())).eq(0);    
  });

  it("should allow e2e redemption with ability to transfer tokens between users", async function () {
    const tokenId = 1;
    const sender = owner.address;
    const sourceChainSelector = 123;
    const payFeesIn = 0; // Pay fees in native currency

    // Mock the IRouterClient's getFee function
    const fee = 100; // Replace with the desired fee amount

    // Mint a sample ERC721 token
    await sample721.mintToken()

    // Attempt to transfer the token without providing CTESMessage as data
    await expect(sample721['safeTransferFrom(address,address,uint256)'](sender, await escrowService_1.getAddress(), tokenId))
      .to.be.revertedWith('Invalid data - escrow needs CTESMessage as data');

    // Get the encoded CTESMessage for the transfer
    const encoded = await escrowService_1.getEncoded(sourceChainSelector, payFeesIn);

    // Attempt to transfer the token without depositing enough fees
    await expect(sample721['safeTransferFrom(address,address,uint256,bytes)'](sender, await escrowService_1.getAddress(), tokenId, encoded))
      .to.be.revertedWith('Insufficient deposit');

    // Get the estimated fees for the transfer
    const fees = await escrowService_1.getFeeEstimate(await sample721.getAddress(), sender, 1, encoded);

    // Ensure the routerClientMock has no balance before the transfer
    expect(await provider.getBalance(await routerClientMock.getAddress())).to.be.eq(0);

    // Send Ether to the escrowService to pay for the token transfer
    const tx = await owner.sendTransaction({
      to: await escrowService_1.getAddress(),
      value: fees
    })

    // Wait for the transaction to be mined
    await tx.wait();

    expect(await claimNote721_2.balanceOf(sender)).eq(0);
    expect(await sample721.balanceOf(await escrowService_1.getAddress())).eq(0);
    
    // Transfer the ERC721 token to the escrowService
    await sample721['safeTransferFrom(address,address,uint256,bytes)'](sender, await escrowService_1.getAddress(), tokenId, encoded);

    // Ensure that the routerClientMock has received the fees
    expect(await provider.getBalance(await routerClientMock.getAddress())).to.be.eq(fees);
    expect(await sample721.balanceOf(await escrowService_1.getAddress())).eq(1);

    // confirm there is a claimable note on the destination chain
    expect(await claimNote721_2.balanceOf(sender)).eq(1);
    expect(await claimNote721_1.balanceOf(sender)).eq(0);
    
    await claimNote721_2.safeTransferFrom(sender, user1.address, 0);
    expect(await claimNote721_2.balanceOf(user1.address)).eq(1);
    expect(await claimNote721_2.balanceOf(sender)).eq(0);
    
    // try to redeem token (user1)
    const tx2 = await user1.sendTransaction({
      to: await escrowService_2.getAddress(),
      value: await escrowService_2.getFeeEstimateForClaim(sender, 0)
    })

    // // Wait for the transaction to be mined
    await tx2.wait();

    console.log(await claimNote721_2.findNote(0));
    // await expect(claimNote721_2.safeTransferFrom(sender, await escrowService_2.getAddress(), 0)).to.be.revertedWith('ERC721InsufficientApproval*');
    try {
      await claimNote721_2.safeTransferFrom(sender, await escrowService_2.getAddress(), 0);
      assert.fail('failed, expected safe transfer to fail as sender no longer owns the token');
    } catch {}
    
    await claimNote721_2.connect(user1).safeTransferFrom(user1.address, await escrowService_2.getAddress(), 0);

    expect(await sample721.ownerOf(1)).eq(user1.address);
    expect(await claimNote721_1.balanceOf(user1.address)).eq(0);
    expect(await claimNote721_1.balanceOf(await escrowService_1.getAddress())).eq(0);
    expect(await claimNote721_1.balanceOf(await escrowService_2.getAddress())).eq(0);

    expect(await claimNote721_2.balanceOf(user1.address)).eq(0);
    expect(await claimNote721_2.balanceOf(await escrowService_1.getAddress())).eq(0);
    expect(await claimNote721_2.balanceOf(await escrowService_2.getAddress())).eq(0);    
  });
});
