const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ChainlinkTokenEscrowService", function () {
  let owner: any;
  let linkToken: { getAddress: () => any; };
  let claimNote721: any;
  let escrowService: any;
  let routerClientMock: any;
  let sample721: any;
  let provider: any;

  beforeEach(async function () {
    // Deploy mock contracts and ChainlinkTokenEscrowService
    [owner] = await ethers.getSigners();

    provider = ethers.provider;
    const StakeWiseWhitelistNFT = await ethers.getContractFactory("StakeWiseWhitelistNFT");
    const whitelist = await StakeWiseWhitelistNFT.deploy();

    const LinkToken = await ethers.getContractFactory("MockLink");
    linkToken = await LinkToken.deploy(1000000);

    const ClaimNote721 = await ethers.getContractFactory("ClaimNote721");
    claimNote721 = await ClaimNote721.deploy();

    const RouterClientMock = await ethers.getContractFactory("RouterClientMock");
    routerClientMock = await RouterClientMock.deploy();

    const SampleERC721 = await ethers.getContractFactory("SampleERC721");
    sample721 = await SampleERC721.deploy();
    const ChainlinkTokenEscrowService = await ethers.getContractFactory(
      "ChainlinkTokenEscrowServiceOverride"
    );
    escrowService = await ChainlinkTokenEscrowService.deploy(
      await routerClientMock.getAddress(),
      await linkToken.getAddress(),
      await claimNote721.getAddress(),
      await whitelist.getAddress()
    );

    await claimNote721.transferOwnership(await escrowService.getAddress());

    await whitelist.addWhitelistContract(await sample721.getAddress());

    await whitelist.addWhitelistContract(await claimNote721.getAddress());


    await escrowService.updateCTESMapping(123, owner.address);
  });

  it("should receive and process an ERC721 token", async function () {
    const tokenId = 1;
    const sender = owner.address;
    const sourceChainSelector = 123;
    const payFeesIn = 0; // Pay fees in native currency

    // Mock the IRouterClient's getFee function
    const fee = 100; // Replace with the desired fee amount

    // Mint a sample ERC721 token
    await sample721.mintToken()

    // Attempt to transfer the token without providing CTESMessage as data
    await expect(sample721['safeTransferFrom(address,address,uint256)'](sender, await escrowService.getAddress(), tokenId))
      .to.be.revertedWith('Invalid data - escrow needs CTESMessage as data');

    // Get the encoded CTESMessage for the transfer
    const encoded = await escrowService.getEncoded(sourceChainSelector, payFeesIn);

    // Attempt to transfer the token without depositing enough fees
    await expect(sample721['safeTransferFrom(address,address,uint256,bytes)'](sender, await escrowService.getAddress(), tokenId, encoded))
      .to.be.revertedWith('Insufficient deposit');

    // Get the estimated fees for the transfer
    const fees = await escrowService.getFeeEstimate(await sample721.getAddress(), sender, 1, encoded);

    // Ensure the routerClientMock has no balance before the transfer
    expect(await provider.getBalance(await routerClientMock.getAddress())).to.be.eq(0);

    // Send Ether to the escrowService to pay for the token transfer
    const tx = await owner.sendTransaction({
      to: await escrowService.getAddress(),
      value: fees
    })

    expect((await routerClientMock.latestMessage())[0]).eq('0x');
    expect((await routerClientMock.latestMessage())[1]).eq('0x');
    expect((await routerClientMock.latestMessage())[2]).eq('0x0000000000000000000000000000000000000000');
    expect((await routerClientMock.latestMessage())[3]).eq('0x');

    // Wait for the transaction to be mined
    await tx.wait();

    // Transfer the ERC721 token to the escrowService
    await sample721['safeTransferFrom(address,address,uint256,bytes)'](sender, await escrowService.getAddress(), tokenId, encoded);

    // Ensure that the routerClientMock has received the fees
    expect(await provider.getBalance(await routerClientMock.getAddress())).to.be.eq(fees);

    // Ensure that the routerClientMock has received the message
    // console.log(await routerClientMock.latestMessage());
    expect((await routerClientMock.latestMessage())[0]).eq('0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266');
    // expect((await routerClientMock.latestMessage())[1]).eq('0x0000000000000000000000003aa5ebb10dc797cac828524e59a333d0a371443c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000000');
    expect((await routerClientMock.latestMessage())[2]).eq('0x0000000000000000000000000000000000000000');
    expect((await routerClientMock.latestMessage())[3]).eq('0x');
  });

  it("should transfer ERC721 token when receiving a claim message", async function () {
    const tokenId = 1;
    const sender = owner.address;
    const sourceChainSelector = 123;
    const payFeesIn = 0; // Pay fees in native currency

    // Mock the IRouterClient's getFee function
    const fee = 100; // Replace with the desired fee amount

    // Mint a sample ERC721 token
    await sample721.mintToken()

    // Attempt to transfer the token without providing CTESMessage as data
    await expect(sample721['safeTransferFrom(address,address,uint256)'](sender, await escrowService.getAddress(), tokenId))
      .to.be.revertedWith('Invalid data - escrow needs CTESMessage as data');

    // Get the encoded CTESMessage for the transfer
    const encoded = await escrowService.getEncoded(sourceChainSelector, payFeesIn);

    // Attempt to transfer the token without depositing enough fees
    await expect(sample721['safeTransferFrom(address,address,uint256,bytes)'](sender, await escrowService.getAddress(), tokenId, encoded))
      .to.be.revertedWith('Insufficient deposit');

    // Get the estimated fees for the transfer
    const fees = await escrowService.getFeeEstimate(await sample721.getAddress(), sender, 1, encoded);

    // Ensure the routerClientMock has no balance before the transfer
    expect(await provider.getBalance(await routerClientMock.getAddress())).to.be.eq(0);

    // Send Ether to the escrowService to pay for the token transfer
    const tx = await owner.sendTransaction({
      to: await escrowService.getAddress(),
      value: fees
    })

    const abiCoder = ethers.AbiCoder.defaultAbiCoder();

    const msg = abiCoder.encode(["tuple(address,uint256,address,bool)"], [[await sample721.getAddress(), tokenId, sender, false]]);
    
    expect(await claimNote721.balanceOf(sender)).eq(0);
    await escrowService.override_ccipReceive(sourceChainSelector, abiCoder.encode(['address'], [sender]), msg);
    // we should have minted the claim note
    expect(await claimNote721.balanceOf(sender)).eq(1);
  });


});
