import { ethers, network } from "hardhat";

/**
 * Wagers are time-based, this script will add 100 games that users can wager against
 * We set up wagers every 15 minute
 */

const stakeWiseWagerServiceAddress = "0xF5037D7D3E5DF37c0521C4452EAB83a40d258Ed0";
async function main() {
  const swws = await ethers.getContractAt("StakeWiseWagerService", stakeWiseWagerServiceAddress);
  const snft = await ethers.getContractAt("SWNFT", await swws.swnft());
  const nftId = 20; // Number(await snft.counter());

  const configs = [{
    active: true,
    datasource: "",
    description: "Sydney v Melbourne",
    name: "AFL Syd v Melbourne",
    eventId: nftId + 1,
    eventDate: Math.floor(Date.now() / 1000) + 3600 * 1.5,
    image: "",
    url: "", 
  }, {
    active: true,
    datasource: "",
    description: "Brisbane v Carlton",
    name: "AFL Brisbane v Carlton",
    eventId: nftId + 2,
    eventDate: Math.floor(Date.now() / 1000) + 86400/2 * (nftId + 2),
    image: "",
    url: "", 
  }, {
    active: true,
    datasource: "",
    description: "Gold Coast v Richmond",
    name: "AFL Gold Coast v Richmond",
    eventId: nftId + 3,
    eventDate: Math.floor(Date.now() / 1000) + 86400/2 * (nftId + 3),
    image: "",
    url: "", 
  }, {
    active: true,
    datasource: "",
    description: "Carlton v Richmond",
    name: "AFL Carlton v Richmond",
    eventId: nftId + 4,
    eventDate: Math.floor(Date.now() / 1000) + 900 + 86400/2 * (nftId + 4),
    image: "",
    url: "", 
  }, {
    active: true,
    datasource: "",
    description: "Collingwood v Sydney",
    name: "AFL Collingwood v Sydney",
    eventId: nftId + 5,
    eventDate: Math.floor(Date.now() / 1000) + 900+ 86400/2 * (nftId + 5),
    image: "",
    url: "", 
  }];

  for (let i = 0; i < configs.length; ++i) {
    console.log('Creating Game', configs[i]);
    await (await swws.createGameConfig(configs[i])).wait();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});