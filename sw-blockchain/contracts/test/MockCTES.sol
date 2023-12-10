// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../service/ChainlinkTokenEscrowService.sol"; // Import the original contract

/**
 * Mock for testing the ccip receive function (which is internal)
 * Test cases will use this to make sure the function can be 'simulated'
 */
contract ChainlinkTokenEscrowServiceOverride is ChainlinkTokenEscrowService {
    constructor(
        address router,
        address link,
        address claimNote,
        address whitelist
    ) ChainlinkTokenEscrowService(router, link, claimNote, whitelist) {}

    function override_ccipReceive(
        uint64 sourceChainSelector,
        bytes memory sender,
        bytes memory data
    ) public {
        Client.Any2EVMMessage memory message;
        // message.messageId = messageId;
        message.sourceChainSelector = sourceChainSelector;
        message.sender = sender;
        message.data = data;
        super._ccipReceive(message); // Call the parent contract's _ccipReceive
    }
}