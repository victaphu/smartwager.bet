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

Chainlink CCIP is the backbone of our NFT Token Escrow Service. We take advantage of the message transfer service to escrow NFTs between chains.  

- Steve wants to bring his NFT into the Polygon network. He wants to use the NFT in liquidity and speculation events on a low-cost network
- He transfers the NFT to the Chainlink Token Escrow  Service. A CCIP message is sent to the polygon network
- On polygon side, a ClaimNote is minted. Holder of this note can burn it to redeem the original NFT
- The ClaimNote is transferred automatically to Steve’s wallet on the Polygon Side   


### Claiming NFTs
![staking nft](./images/ccip-claim-and-unlock.png "CCIP Chainlink Token Escrow Service - Claim and Unlock")
Once the NFT is in Steve’s wallet he can start using the Smart Wager Service.   

- Steve sees a wager he likes and create a Wager Event (dNFT). He puts his claim note into the dNFT escrow. The wager event is published.  
- Victa sees this and decides to bet against Steve. He transfers his NFT into the Wager Event. 
- When the event completes, Chainlink Automation will wake up our smart contract who will then use Chainlink functions to retrieve the result of the wager. Both NFTs are automatically sent to Steve once we’ve confirmed that Steve is the winner. All in a trust-reduced environment.


### SmartWager Platform
![staking nft](./images/ca-cf-stakewise-bet.png "SmartWager Wager Platform Service")

Steve now wants to claim the NFT he won. It turns out Victa also used the CTES to send his NFT to Stakewise. Steve now holds the NFT Claim Note to the penguin on the original chain.  

- Steve calls claim on the note, burning it in the process
- CTES creates a CCIP message and sends it to the originating chain (it has all this information when it first mints the Claim Note)
- The redeem function is called and a message arrives on the originating chain.
- The redeem request is received and the token is then removed from escrow
- The NFT is finally sent to Steve who can now do anything with the NFT



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
