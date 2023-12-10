// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../iface/IStakeWiseWagerService.sol";
import "../iface/ISWResultSource.sol";
import "../iface/ISWNFT.sol";
import "../tokens/ClaimNote721.sol";

/**
 * @title StakeWiseWagerService
 * @notice A betting marketplace service for managing NFT-based wagers on various events.
 * @dev Each wager option is represented as a dynamic NFT. These NFTs are tied to a data source, 
 * and the winner of the wager gets the NFT. The contract handles the creation, updating, 
 * and cancellation of games and wagers.
 *
 * @author Victa
 */
contract StakeWiseWagerService is Ownable, AutomationCompatibleInterface, IStakeWiseWagerService {
    
    // Mapping of game ID to game details
    mapping(uint256 => Games) public games;

    // Mapping of game ID to count of active games
    mapping(uint256 => uint256) public activeGamesCount;

    // Mapping of timestamp to array of game IDs
    mapping(uint256 => uint256[]) public timestampToGames;

    // Address of the SWNFT contract
    address public immutable swnft;

    // Address of the result source contract
    address public immutable resultSource;

    address public forwarder;

    event GameCreated(uint256 gameId);
    event WagerCreated(uint256 gameId, address owner);
    event GameCancelled(uint256 gameId);
    event UpkeepPerformed();

    /**
     * @notice Constructor for StakeWiseWagerService
     * @param swfnftAddress Address of the SWNFT contract. this is the NFT for the wagers
     * @param source Address of the result source contract. this generates results for various games
     */
    constructor(address swfnftAddress, address source) Ownable(msg.sender) {
        require(swfnftAddress != address(0), "invalid swfnftAddress");
        swnft = swfnftAddress;
        resultSource = source;
    }

    ///
    /// Automation function
    ///

    /**
     * Restrict to only the forwarder
     */
    function setForwarder(address _forwarder) external onlyOwner() {
        forwarder = _forwarder;
    }

    /**
     * @notice automation function to check if upkeep needs to be performed
     * @dev upkeep must be performed only if there are active games for the given 5 minute timeslot
     * @param - data to check
     * @return bool should we perform upkeep?
     * @return data additional data to pass
     */
    function checkUpkeep(
        bytes calldata /*checkData*/
    ) external override view returns (bool, bytes memory) {
        // 
        uint256 timeslot = roundToNearestFifteenMinutes(block.timestamp);
        if (activeGamesCount[timeslot] == 0) {
            return (false, bytes("")); // don't need to process, no valid games
        }

        return (true, bytes(""));
    }

    /**
     * @notice Finds and processes game results for a given timeslot. multiple games can exist in a timeslot, each will be called
     * @dev If there are no active games in the timeslot, the result fetching is skipped
     * @param - additional data passed into the perform upkeep function
     */
    function performUpkeep(bytes calldata /*performData*/) external override {
        require(msg.sender == forwarder, 'not forwarder cannot call find game results');
        uint256 timeslot = roundToNearestFifteenMinutes(block.timestamp);
        if (activeGamesCount[timeslot] == 0) {
            return; // don't need to process, no valid games
        }
        if (timestampToGames[timeslot].length == 0) {
            return;
        }
        
        emit UpkeepPerformed();
        ISWResultSource(resultSource).requestResult(timeslot, timestampToGames[timeslot]);
    }

    ///
    /// Functions Inherited from IStakeWiseWagerService
    ///
    function findGameById(
        uint256 id
    ) external override view returns (Games memory game) {
        return games[id];
    }

    /**
     * @notice Updates the result of a single game
     * @dev This function is used if games have different results and each game result needs to be updated individually.
     * @param game The game struct containing details of the game to update
     * @param result The result of the game
     */
    function updateGameResult(
        uint256 game,
        uint256 result
    ) external override {
        require(
            msg.sender == resultSource,
            "only the result source can call update game result"
        );
        require(games[game].eventId > 0, "game does not exist");
        require(result > 0, "result must be greater than 0");
        require(games[game].active, 'game is no longer active');
        ISWNFT(swnft).updateResult(game, result);
    }

    /**
     * @notice update game results, only callable by the Result Source contract set at constructor
     * @dev this function updates internal state of the dNFT (SWNFT). It should only be called by
     * chainlink function results
     * @param _games list of games 
     * @param result result applied for every game configuration instance
     */
    function updateGameResults(
        uint256[] memory _games,
        uint256 result
    ) external override {
        
        require(
            msg.sender == resultSource,
            "only the result source can call update game result"
        );
        // expect games to be valid (should we check?)
        require(result > 0, "result must be greater than 0");
        for (uint256 i = 0; i < _games.length; ++i) {
            if (games[_games[i]].active) {
                ISWNFT(swnft).updateResult(_games[i], result);
            }
        }
    }

    ///
    /// Functions for creating games and minting NFTs for game instances and cancelling game instances
    ///

    /**
     * @notice Creates a game configuration. this is done by the contract owner and controls what games users can wager on,
     * time that the wager results are generated, and configuration for the wager
     * @dev This function is used to configure a new game for betting
     * @param game Game struct containing the details of the game
     */
    function createGameConfig(Games memory game) external onlyOwner {
        require(
            games[game.eventId].eventId == 0,
            "cannot create game, it already exists"
        );
        require(game.eventId > 0, "event id must be > 0");
        require(game.active, "created game config must be active");
        require(game.eventDate > block.timestamp + 10 minutes, "created game config event date must be after current time");
        games[game.eventId] = game;

        // normalise the timestamp to games
        timestampToGames[roundToNearestFifteenMinutes(game.eventDate)].push(
            game.eventId
        );
        emit GameCreated(game.eventId);
    }

    function getGameByTimeSlot(uint256 timeslot) external view returns(uint256[] memory) {
        return timestampToGames[timeslot];
    }

    /**
     * @notice Creates a wager for a specified event
     * @param eventId ID of the event to create a wager for
     */
    function createWager(uint256 eventId) external {
        require(
            games[eventId].eventId > 0,
            "cannot create wager, event id does not exist"
        );
        require(
            games[eventId].eventDate > block.timestamp + 10 minutes,
            "cannot create wager where event is about to begin"
        );
        require(games[eventId].active, 'game is no longer active');
        // mint
        ISWNFT(swnft).mint(msg.sender, eventId);
        // we store the slot
        // note: there is still work to be done (tracking when the game becomes active for example)
        activeGamesCount[roundToNearestFifteenMinutes(games[eventId].eventDate)] += 1;

        emit WagerCreated(eventId, msg.sender);
    }

    /**
     * @notice Cancels a game by its ID
     * @param gameId ID of the game to cancel
     */
    function cancelGame(uint256 gameId) external onlyOwner {
        require(games[gameId].active, 'game already cancelled');
        games[gameId].active = false; // disable the game

        emit GameCancelled(gameId);
    }

    ///
    /// Helper Functions
    ///

    function roundToNearest() public view returns (uint256) {
        return roundToNearestFifteenMinutes(block.timestamp);
    }

    /**
     * @notice Rounds a timestamp to the nearest 15 minutes
     * @param timestamp The original timestamp
     * @return The rounded timestamp
     */
    function roundToNearestFifteenMinutes(
        uint timestamp
    ) public pure returns (uint) {
        return ((timestamp + 150) / 900) * 900;
    }
}
