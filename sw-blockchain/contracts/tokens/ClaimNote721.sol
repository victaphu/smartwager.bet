// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ClaimNote721
 * @notice ClaimNote721 is an ERC721 token designed for locking and claiming NFTs across various chains in conjunction with the CTES (Chainlink Token Escrow Service). It facilitates the bridging of NFTs by creating claim notes, which represent the bridged NFTs on the destination chain.
 *
 * @author Victa
 */
contract ClaimNote721 is ERC721URIStorage, Ownable {

    // Constant URI for the token metadata
    string constant TOKEN_URI =
        "https://ipfs.io/ipfs/QmYuKY45Aq87LeL1R5dhb1hqHLp6ZFbJaCP8jxqKM1MX6y/babe_ruth_1.json";
    
    // Internal tokenId to keep track of the next mintable token
    uint256 internal tokenId;

    // Structure to define a claim note
    struct ClaimNote {
      uint64 sourceChain;
      address sourceTokenAddress;
      uint256 sourceTokenId;
    }

    // Mapping to store claim notes against their respective token IDs
    mapping(uint256 => ClaimNote) public claimNotes;

    constructor() ERC721("StakeWise Claim Note", "SWC") Ownable(msg.sender) {}
 
    /**
     * @notice Mints a new claim note token
     * @dev Can only be called by the owner (typically the CTES contract)
     * @param to Receiver of the claim note
     * @param sourceChainSelector The originating chain of the bridged NFT
     * @param sourceTokenAddress The address of the NFT on the source chain
     * @param sourceTokenId The token ID of the NFT on the source chain
     */
    function mint(address to, uint64 sourceChainSelector, address sourceTokenAddress, uint256 sourceTokenId) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, TOKEN_URI);

        claimNotes[tokenId] = ClaimNote(sourceChainSelector, sourceTokenAddress, sourceTokenId);

        unchecked {
            tokenId++;
        }
    }

    /**
     * @notice Retrieves the details of a specific claim note
     * @param noteId The ID of the claim note to find
     * @return The ClaimNote struct containing details about the note
     */
    function findNote(uint256 noteId) public view returns(ClaimNote memory) {
      return claimNotes[noteId];
    }

    /**
     * @notice Burns a claim note to prevent its reuse after claiming
     * @dev Can only be called by the owner and requires that the current holder of the claim note is the owner of this contract. This is typically called post-transfer.
     * @param - The address of the claim note holder
     * @param claimNote The ID of the claim note to be burned
     */
    function claim(address, uint256 claimNote) public onlyOwner {
      require(ownerOf(claimNote) == owner(), 'not owner');
      delete claimNotes[claimNote];
      _burn(claimNote);
    }
}