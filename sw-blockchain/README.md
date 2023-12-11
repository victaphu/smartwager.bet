# SmartWager.Bet - Chainlink Constellation Hackathon (2023)
Stake your NFT, choose your wager and use the staked NFT as collateral.  
SmartWager allow you to bridge your NFTs onto the SmartWager platform, mint clamnotes and use these notes to wager against various events.  

The SmartWager platform will automatically manage the wager, results, and disbursement. Each wager is represented as a dNFT holding the 
wager details and results. The dNFT is updated using Chainlink Automation and Chainlink VRF. Future automation will use real-world events.

# Setup
- npx hardhat compile
- npx hardhat test

# Deployments
## Chainlink Token Escrow Service  
### Ethereum Sepolia Network  
Deploying Chainlink Token Escrow Service 11155111

Deploy SampleERC721 Token
  Deployed! 0x56C1423ea54faEC00a7633aAA2F8Bf4A958fA0d2
Deploy ClaimNote Token
  Deployed! 0x5879960452be1E1c41fDD0E1F51376DC17a42584
Deploy NFT Whitelist
  Deployed! 0x3CF34a58a5A50B6038589F67247712440075B847
Adding NFTs to Whitelist
Deploying ChainlinkTokenEscrowService
  Deployed! 0x9692f4a851175a86Fa83caE65EAD7E9629c1caf1
Transferring Ownership Permissions
  Ownership Transferred 0x72d4af27a897c307d9365b9804252ab20a46a251d26bf707e4ea64fd84fc17f2
Done

### Polygon Mumbai Network  
Deploying Chainlink Token Escrow Service 80001

Deploy SampleERC721 Token
  Deployed! 0xf93B7198085AFc5948C02176908Db0701a180594
Deploy ClaimNote Token
  Deployed! 0x6A1CB242421871361E7C87f08D1b17dfB176492e
Deploy NFT Whitelist
  Deployed! 0xa874c8CafeAFE8937a92bC261a8Fe53aeA53F6DF
Adding NFTs to Whitelist
Deploying ChainlinkTokenEscrowService
  Deployed! 0xB7C5A47449C179B8eD4f59082daa5E93F888Cb9f
Transferring Ownership Permissions
  Ownership Transferred 0x034ba621e29e454ef6aa3f7f5c0de46b0c85954dbefd591443900fcc951404bf
Done

## SmartWager.Bet Infrastructure
Deploying Stakewise.Bet -  80001  
Deploy StakeWiseRandom  
  Deployed! 0x41027B2986F7388947Dab5C8acfAA9bd8d8Dbc4f  
Deploy SWNFT  
  Deployed! 0x9C1A28B6b1B14CB1f7CE756f99b99bf8318679Fd  
Deploy StakeWiseWagerService  
  Deployed! 0xF5037D7D3E5DF37c0521C4452EAB83a40d258Ed0  
Transferring Ownership Permissions  
  Transferring SWNFT to StakeWise  
  SWNFT Ownership Transferred 0xcf1a9f51f64374453771dd2aa5966731fbfbdb69d4ea63b1c06b91fd7446e592  
  Transferring StakeWiseRandom to StakeWise  
  StakeWiseRandom Ownership Transferred 0x8295e79ae9356c6200b9b5f830dd451a5b709475eeae32da06dfff272cefffd2  


Forwarder Address: 0x5f8a904D34eda5a1a6Fe7953F8C0f53b0586BcA6  

## Installation
- npm install
- npm run compile
- npx hardhat test
- npx hardhat run --network polygon_mumbai scripts/deployChainlinkTokenEscrowService.ts
- npx hardhat run --network sepolia scripts/deployChainlinkTokenEscrowService.ts

In the output, find the whitelist address and replace the whitelist inside deployStakeWiseInfrastructure.ts with the whitelist (shared whitelist)  

- npx hardhat run --network polygon_mumbai scripts/deployStakeWiseInfrastructure.ts

Seed it with some wagers  

- npx hardhat run --network polygon_mumbai scripts/operations/addAdditionalWagers.ts 

See the root folder readme file for more information