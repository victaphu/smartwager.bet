# SmartWager.Bet - Chainlink Constellation Hackathon (2023)
Stake your NFT, choose your wager and use the staked NFT as collateral.  
SmartWager allow you to bridge your NFTs onto the SmartWager platform, mint clamnotes and use these notes to wager against various events.  

The SmartWager platform will automatically manage the wager, results, and disbursement. Each wager is represented as a dNFT holding the 
wager details and results. The dNFT is updated using Chainlink Automation and Chainlink VRF. Future automation will use real-world events.

## Transaction Records
CCIP - 
https://ccip.chain.link/msg/0xbfbbf3dca0538be4bf0df3e1d7dbe7b66e3d5e800b786f78dd74a2d0c15ad822 - After token mint, send it from Sepolia to Mumbai  
https://ccip.chain.link/msg/0x8189d017cab27b3a414421faf1266811a0b472e20dcc09d02dcabb72ac4ba659 - Claim Note is burnt on Mumbai and NFT reclaimed on Sepolia side  

Chainlink Functions - 
Chainlink VRF - 


## Tech Stack
### Staking NFTs
![staking nft](./images/ccip-lock-and-mint.png "CCIP Chainlink Token Escrow Service - Lock and Mint")

- CCIP 

### Claiming NFTs
![staking nft](./images/ccip-claim-and-unlock.png "CCIP Chainlink Token Escrow Service - Claim and Unlock")


### SmartWager Platform
![staking nft](./images/ca-cf-stakewise-bet.png "SmartWager Wager Platform Service")


## Setup

### Setup Blockchain
- cd sw-blockchain
- npm install
- npm run compile
- npx hardhat test
- npx hardhat run --network polygon_mumbai scripts/deployChainlinkTokenEscrowService.ts
- npx hardhat run --network sepolia scripts/deployChainlinkTokenEscrowService.ts

In the output, find the whitelist address and replace the whitelist inside deployStakeWiseInfrastructure.ts with the whitelist (shared whitelist)  

- npx hardhat run --network polygon_mumbai scripts/deployStakeWiseInfrastructure.ts

Seed it with some wagers  

- npx hardhat run --network polygon_mumbai scripts/operations/addAdditionalWagers.ts 


### Setup Frontend
- cd sw-frontend
- Edit .env file and add the wallet connect key
- npm install
- Edit the components/common/common.jsx with the newly deployed smart contracts above
- npm run dev
