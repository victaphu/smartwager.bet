// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../common/WagerType.sol";

/**
 * @title IStakeWiseWagerService
 * @notice Interface for the StakeWise Wager Service. This service is responsible for managing game wagers, which can be used to mint SWNFTs (StakeWise Non-Fungible Tokens) for each wager. The service provides functionality for querying game details and updating game results. 
 * @dev In a demo setting, results might be generated randomly, but in a production environment, results would typically be obtained via an API callback.
 */
interface IStakeWiseWagerService {
    /**
     * @notice Represents a wager event in a game
     * @dev Struct to store details of each game event
     */
    struct Games {
        string description; // Description of the game
        string name;        // Name of the game
        string url;         // URL to the game event, if applicable
        string image;       // Image reference for the game
        uint256 eventId;    // Unique ID for the event
        uint256 eventDate;  // Date and time (Unix timestamp) when the event starts
        string datasource;  // URL for the data source of the game results
        bool active;        // Indicates whether the game is still active. Some games may be deactivated.
    }

    /**
     * @notice Finds a game by its ID
     * @param id The unique ID of the game
     * @return Games The game struct containing details of the specified game
     */
    function findGameById(uint256 id) external view returns (Games memory);

    /**
     * @notice Updates the result of a single game
     * @dev This function is used if games have different results and each game result needs to be updated individually.
     * @param game The game id containing details of the game to update
     * @param result The result of the game
     */
    function updateGameResult(
        uint256 game,
        uint256 result
    ) external;

    /**
     * @notice Updates the results of multiple games
     * @dev This function is used for batch updating the results of multiple games, especially when all games have the same result.
     * @param games An array of game ids to be updated
     * @param result The result to be applied to all specified games
     */
    function updateGameResults(
        uint256[] memory games,
        uint256 result
    ) external;
}
