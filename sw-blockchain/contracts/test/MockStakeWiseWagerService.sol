// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../iface/IStakeWiseWagerService.sol";

contract MockStakeWiseWagerService is IStakeWiseWagerService {
    mapping(uint256 => uint256 result) public gameIdMapping;

    function findGameById(uint256 id) external view returns (Games memory) {}

    function updateGameResult(uint256 game, uint256 result) external {
      gameIdMapping[game] = result;
    }

    function updateGameResults(
        uint256[] memory games,
        uint256 result
    ) external {
      for(uint256 i = 0; i < games.length; ++i) {
        gameIdMapping[games[i]] = result;
      }
    }

    function roundToNearestFiveMinutes() public view returns (uint) {
        return ((block.timestamp + 150) / 300) * 300;
    }
}
