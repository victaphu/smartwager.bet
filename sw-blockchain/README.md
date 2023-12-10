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
  Deployed! 0xf57453BAc04e08E40564f7d02e522248292F8da8  
Deploy ClaimNote Token  
  Deployed! 0x7DD026718C0b0c5d4876f394cD6f655C262dF531  
Deploy NFT Whitelist  
  Deployed! 0x3c268F1b5654595808344F9883Ce5fDE6524980b  
Adding NFTs to Whitelist  
Deploying ChainlinkTokenEscrowService  
  Deployed! 0x9C1A28B6b1B14CB1f7CE756f99b99bf8318679Fd  
Transferring Ownership Permissions  
  Ownership Transferred 0x5af52e529d232d370d08b2337abe1d13b69ca07d8ff60512b345db3875fe35f7  
Done

### Polygon Mumbai Network  
Deploying Chainlink Token Escrow Service 80001  

Deploy SampleERC721 Token  
  Deployed! 0xB0722A679Ed6790c6c810B3D1e9967f45Ef2a6A0  
Deploy ClaimNote Token  
  Deployed! 0x2C8fBEf9f411CD6468fB2376Ad08Ca7AC86bC432  
Deploy NFT Whitelist  
  Deployed! 0x89D60FE741e0DD9731C1f18FdC04375c4E1CF241  
Adding NFTs to Whitelist  
Deploying ChainlinkTokenEscrowService  
  Deployed! 0x3c268F1b5654595808344F9883Ce5fDE6524980b  
Transferring Ownership Permissions  
  Ownership Transferred 0xbfddad6304201ef75f93a579e71bdf04b2599b084118475ae682d03414a74676  
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
