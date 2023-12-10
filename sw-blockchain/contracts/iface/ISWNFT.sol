// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../common/WagerType.sol";

/**
 * @title ISWNFT
 * @notice Interface for StakeWise NFTs. This interface defines the basic functionalities for minting and updating the result of a StakeWise NFT, which are linked to games in the StakeWise Wager Service.
 * @dev This interface provides an abstraction for the NFTs used in the StakeWise platform, focusing on gaming-related functionalities.
 *
 * @author Victa
 */
interface ISWNFT {
    /**
     * @notice Mints a new NFT for a player linked to a specific game
     * @dev When minting an NFT, provide the player's address and a reference to the game ID from the StakeWiseWager service.
     * @param player The address of the player who will receive the NFT
     * @param gameId The ID of the game associated with the NFT
     */
    function mint(address player, uint256 gameId) external;

    /**
     * @notice Updates the result of a game linked to a specific NFT
     * @dev This function is used to update the outcome of a game. It follows a PULL method where users can retrieve and validate the result.
     * @param gameId The ID of the game whose result is being updated
     * @param result The result of the game to update
     */
    function updateResult(uint256 gameId, uint256 result) external;
}
