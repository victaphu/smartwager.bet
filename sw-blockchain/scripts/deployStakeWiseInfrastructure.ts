import { ethers, network } from "hardhat";

/**
 * Deploy
 * 1. Deploy SWNFT on Polygon
 * 2. Deploy the StakewiseRandom datasource
 * 3. Deploy StakewiseWagerService
 * 
 * Shoud be deployed on polygon for gas optimisation
 */

const VRFCoordinator = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
const keyHash = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";
const subscriptionId = 6673;

const whiteListAddress = "0x89D60FE741e0DD9731C1f18FdC04375c4E1CF241";

async function main() {
  console.log('Deploying Stakewise.Bet - ', network.config.chainId);
  if (network.config.chainId !== 80001) {
    console.log("!! Stakewise.bet infra is only available on polygon");
    return; 
  }

  console.log("Deploy StakeWiseRandom");
  const stakeWiseRandom = await (await ethers.deployContract("StakeWiseRandom", [subscriptionId, VRFCoordinator, keyHash])).waitForDeployment();
  const stakeWiseRandomAddress = await stakeWiseRandom.getAddress();
  console.log("  Deployed!", stakeWiseRandomAddress);

  console.log("Deploy SWNFT");
  const swnft = await (await ethers.deployContract("SWNFT", [whiteListAddress])).waitForDeployment();
  const swnftAddress = await swnft.getAddress();
  console.log("  Deployed!", swnftAddress);
  
  console.log("Deploy StakeWiseWagerService");
  const stake = await (await ethers.deployContract("StakeWiseWagerService", [swnftAddress, stakeWiseRandomAddress])).waitForDeployment();
  const stakeAddress = await stake.getAddress();
  console.log("  Deployed!", stakeAddress);


  console.log('Transferring Ownership Permissions');
  console.log('  Transferring SWNFT to StakeWise');
  const result = await (await swnft.transferOwnership(stakeAddress)).wait();
  console.log('  SWNFT Ownership Transferred', result?.hash);

  console.log('  Transferring StakeWiseRandom to StakeWise');
  const result2 = await (await stakeWiseRandom.transferOwnership(stakeAddress)).wait();
  console.log('  StakeWiseRandom Ownership Transferred', result2?.hash);
  
}

// should automate this, for now we do manually here is the forwarder address: 0x5f8a904D34eda5a1a6Fe7953F8C0f53b0586BcA6
const forwarder = "0x5f8a904D34eda5a1a6Fe7953F8C0f53b0586BcA6";
const stakeAddress = "0xF5037D7D3E5DF37c0521C4452EAB83a40d258Ed0";
async function setForwarder() {
  console.log("Setting forwarder", forwarder, "for", stakeAddress);
  const instance = await ethers.getContractAt("StakeWiseWagerService", stakeAddress);
  await instance.setForwarder(forwarder);
}

async function updateWhitelist() {
  const whitelist = "0xa874c8CafeAFE8937a92bC261a8Fe53aeA53F6DF";
  const instance = await ethers.getContractAt("StakeWiseWhitelistNFT", whitelist);
  // await instance.setForwarder(forwarder);
  await (await instance.addWhitelistContract("0xf93B7198085AFc5948C02176908Db0701a180594")).wait();
  await (await instance.addWhitelistContract("0x6A1CB242421871361E7C87f08D1b17dfB176492e")).wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// setForwarder().catch((e) => {
//
  //  console.log(e);
//   process.exitCode = 1;
// })

updateWhitelist().catch((e) => {
  console.log(e);
  process.exitCode = 1;
})