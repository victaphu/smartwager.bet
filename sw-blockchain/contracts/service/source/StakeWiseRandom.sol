// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../../iface/IStakeWiseWagerService.sol";
import "../../iface/ISWResultSource.sol";

/**
 * @title StakeWiseRandom
 * @notice A contract that generates random binary results for the StakeWise wager service using Chainlink VRF.
 * @dev Implements VRFConsumerBaseV2 for Chainlink's VRF functionality.
 * 
 * @author Victa
 */
contract StakeWiseRandom is ISWResultSource, Ownable, VRFConsumerBaseV2 {
        // VRFCoordinatorV2Interface reference for interacting with Chainlink VRF
    VRFCoordinatorV2Interface immutable COORDINATOR;

    // Chainlink VRF subscription ID
    uint64 immutable s_subscriptionId;

    // Chainlink VRF key hash
    bytes32 immutable s_keyHash;

    // Gas limit for the VRF callback function
    uint32 constant CALLBACK_GAS_LIMIT = 100000;

    // Number of confirmations required for a VRF request
    uint16 constant REQUEST_CONFIRMATIONS = 3;

    // Number of random values to request
    uint32 constant NUM_WORDS = 1;

    // Maps timestamps to arrays of game requests
    mapping(uint256 => uint256[]) public timestampToGamesRequests;

    // Maps request IDs to timestamps (slots)
    mapping(uint256 => uint256) public requestIdToSlots;

    event ResultRequested(uint256 timeslot, uint256[] games, uint256 requestId);

    /**
     * @notice Constructor for StakeWiseRandom
     * @param subscriptionId The Chainlink VRF subscription ID
     * @param vrfCoordinator The address of the Chainlink VRF Coordinator
     * @param keyHash The key hash for Chainlink VRF
     */
    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 keyHash
    ) VRFConsumerBaseV2(vrfCoordinator) Ownable(msg.sender) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_keyHash = keyHash;
        s_subscriptionId = subscriptionId;
    }

    function getGamesByTimestamp(uint256 timestamp) external view returns (uint256[] memory) {
      return timestampToGamesRequests[timestamp];
    }

    /**
     * @notice Callback function used by VRF Coordinator to return the random number
     * @dev The function assumes each game generates its own set of results and updates game results accordingly. 
     * All games in a given request share the same random result in this implementation.
     * @param requestId The ID of the VRF request
     * @param randomWords Array of random numbers from the VRF Coordinator
     */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
      require(requestIdToSlots[requestId] > 0, 'no valid request id to slot mapping');
      require(randomWords.length > 0, 'must have at least one random result from the vrf');
      require(timestampToGamesRequests[requestIdToSlots[requestId]].length > 0, 'no valid game registered for timeslot and request id');

      // the assumption is that each game will generate its own set of results (via function calls) and
      // we can call each update result as the game result arrives. in our random case all our games have the same result

      IStakeWiseWagerService(address(owner())).updateGameResults(timestampToGamesRequests[requestIdToSlots[requestId]], randomWords[0]%2 + 1);
    }

    /**
     * @notice Requests a random result for a specified timeslot and a set of games
     * @dev Generates a single random value for all games in the request. The result updates the StakeWise wager results.
     * @param timeslot The timeslot for which the games are scheduled
     * @param games An array of games for which the random result is requested
     */
    function requestResult(
        uint256 timeslot,
        uint256[] memory games
    ) external onlyOwner() {
        require(
            timestampToGamesRequests[timeslot].length == 0,
            "request already made"
        );
        
        timestampToGamesRequests[timeslot] = games;

        uint256 requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );

        requestIdToSlots[requestId] = timeslot;

        emit ResultRequested(timeslot, games, requestId);
    }
}
