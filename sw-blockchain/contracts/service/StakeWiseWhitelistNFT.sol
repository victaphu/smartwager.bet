// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StakeWiseWhitelistNFT
 * @notice A contract to maintain a whitelist of NFT contracts for StakeWise's bridging and token management functionalities. It ensures that only verified smart contracts can interact with the token transfer function, which is crucial for security and proper functioning of the bridging process.
 * @dev This contract is used in conjunction with IERC721Receiver.onERC721Received to ensure that only whitelisted contracts can change the state and trigger CCIP (Chainlink Client Initiated Protocol).
 */
contract StakeWiseWhitelistNFT is Ownable {
    // Mapping to keep track of whitelisted NFT contract addresses
    mapping(address => bool) public whitelistContracts;

    /**
     * @notice Constructor for StakeWiseWhitelistNFT
     */
    constructor() Ownable(msg.sender) {
    }

    /**
     * @notice Adds an NFT contract address to the whitelist
     * @dev Can only be called by the contract owner
     * @param nftAddress The address of the NFT contract to whitelist
     */
    function addWhitelistContract(address nftAddress) external onlyOwner() {
        whitelistContracts[nftAddress] = true;
    }

    /**
     * @notice Removes an NFT contract address from the whitelist
     * @dev Can only be called by the contract owner
     * @param nftAddress The address of the NFT contract to remove from the whitelist
     */
    function removeWhiteListContract(address nftAddress) external onlyOwner {
        whitelistContracts[nftAddress] = false;
    }

    /**
     * @notice Checks if an NFT contract address is whitelisted
     * @param nftAddress The address of the NFT contract to check
     * @return bool Returns true if the NFT contract is whitelisted, false otherwise
     */
    function isWhitelisted(address nftAddress) external view returns(bool){
        return whitelistContracts[nftAddress];
    }
}
