// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MockCTES.sol";

/**
 * Fake router client so we can test the calls being made end to end
 */
contract RouterClientMock_Pipe is Ownable {
    mapping(uint64 => address) public supportedChains;
    mapping(address => uint64) public reverseChains;

    constructor() Ownable(msg.sender) {}

    function register(uint64 chain, address serviceAddress) public onlyOwner() {
        supportedChains[chain] = serviceAddress;
        reverseChains[serviceAddress] = chain;
    }

    // Mock function to get the fee for a specific message ID
    function getFee(uint64, Client.EVM2AnyMessage memory) external view returns (uint256) {
        return 0.1 ether;
    }

    // Mock function to simulate sending a message
    function ccipSend(uint64 targetChainSelector, Client.EVM2AnyMessage memory message)
        external
        payable
        returns (bytes32)
    {
        require(supportedChains[targetChainSelector] != address(0), 'unsupported chain');
        ChainlinkTokenEscrowServiceOverride(payable(supportedChains[targetChainSelector])).override_ccipReceive(reverseChains[msg.sender], message.data, message.data);
        return bytes32(0);
    }
}