# SmartWager.Bet - Chainlink Constellation Hackathon (2023)
Stake your NFT, choose your wager and use the staked NFT as collateral.  
SmartWager allow you to bridge your NFTs onto the SmartWager platform, mint clamnotes and use these notes to wager against various events.  

The SmartWager platform will automatically manage the wager, results, and disbursement. Each wager is represented as a dNFT holding the 
wager details and results. The dNFT is updated using Chainlink Automation and Chainlink VRF. Future automation will use real-world events.

## Transaction Records
CCIP - https://ccip.chain.link/msg/0xbfbbf3dca0538be4bf0df3e1d7dbe7b66e3d5e800b786f78dd74a2d0c15ad822
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
- npx hardhat compile
- npx hardhat test
