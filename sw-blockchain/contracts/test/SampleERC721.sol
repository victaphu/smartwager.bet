// contracts/SampleERC721.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SampleERC721 is ERC721 {
    uint256 private _nextTokenId;

    constructor() ERC721("Sample721", "SAMPLE") {}

    function mintToken() public {
      _nextTokenId += 1;
      _mint(msg.sender, _nextTokenId);
    }
}