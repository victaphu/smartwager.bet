import { ethers, network } from "hardhat";

/**
 * Deploy
 * 1. Deploy Whitelist
 * 2. Deploy ClaimNote 
 * 3. Deploy Sample ERC721
 * 4. Deploy ChainTokenEscrowService
 * 
 * Deployed on all chains we want to operate on
 */

async function getRouterAddress() {
  if (network.config.chainId === 31337) {
    // deploy
    return "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  }
  else {
    // return
    if (network.config.chainId === 80001) {
      return "0x70499c328e1e2a3c41108bd3730f6670a44595d1";
    } else if (network.config.chainId === 11155111) {
      return "0xd0daae2231e9cb96b94c8512223533293c3693bf";
    } else {
      throw new Error("Unsupported Chain - " + network.config.chainId);
    }
  }
}

async function getLinkAddress() {
  if (network.config.chainId === 31337) {
    // deploy
    return "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  }
  else {
    // return
    if (network.config.chainId === 80001) {
      return "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
    } else if (network.config.chainId === 11155111) {
      return "0x779877A7B0D9E8603169DdbD7836e478b4624789"
    } else {
      throw new Error("Unsupported Chain - " + network.config.chainId);
    }
  }
}

async function main() {
  console.log('Deploying Chainlink Token Escrow Service', network.config.chainId);
  console.log('');
  console.log('Deploy SampleERC721 Token');

  const sampleERC721 = await (await ethers.deployContract("SampleERC721")).waitForDeployment();
  const sampleERC721Address = await sampleERC721.getAddress();
  console.log('  Deployed!', sampleERC721Address);

  console.log('Deploy ClaimNote Token');
  const claimNote721 = await (await ethers.deployContract("ClaimNote721")).waitForDeployment();
  const claimNote721Address = await claimNote721.getAddress();
  console.log('  Deployed!', claimNote721Address);

  console.log('Deploy NFT Whitelist');
  const whiteList = await (await ethers.deployContract("StakeWiseWhitelistNFT")).waitForDeployment();
  const whiteListAddress = await whiteList.getAddress();
  console.log('  Deployed!', whiteListAddress);

  console.log('Adding NFTs to Whitelist');
  await whiteList.addWhitelistContract(claimNote721Address);
  await whiteList.addWhitelistContract(sampleERC721);
  
  console.log('Deploying ChainlinkTokenEscrowService');
  const routerAddress = await getRouterAddress();
  const linkAddress = await getLinkAddress();
  const ctes = await (await ethers.deployContract("ChainlinkTokenEscrowService", [routerAddress, linkAddress, claimNote721Address, whiteListAddress])).waitForDeployment();
  const ctesAddress = await ctes.getAddress();
  console.log("  Deployed!", ctesAddress);

  console.log('Transferring Ownership Permissions');
  const result = await (await claimNote721.transferOwnership(ctesAddress)).wait();
  console.log('  Ownership Transferred', result?.hash);
  
  console.log('Done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
