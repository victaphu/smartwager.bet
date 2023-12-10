// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IStakeWiseWagerService.sol";
/**
 * @title ISWResultSource
 * @notice Interface for result sources in the StakeWise platform. This interface defines the method for creating and publishing game results back to the StakeWiseWagerService.
 * @dev In a demonstration setting, this interface might be implemented to provide random results. However, in a production environment, it would typically involve querying results via an API callback.
 */
interface ISWResultSource {

    /**
     * @notice Requests the generation of a result for a specific timeslot and set of games
     * @dev This function is responsible for initiating the process that leads to the creation of a game result, which is then published back to the StakeWiseWagerService. Implementations of this interface can vary based on how results are determined (e.g., random generation, API callbacks, etc.).
     * @param timeslot A specific timeslot for which the game result is requested
     * @param games An array of game ids for which results are being requested
     */
    function requestResult(uint256 timeslot, uint256[] memory games) external;
}
