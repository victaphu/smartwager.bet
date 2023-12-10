export { }
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakeWiseWagerService", function () {
    let wagerService: any, owner: any, addr1: any;
    const gameId = 1; // Example game ID for testing
    let forwarder: any;
    const fifteenMinutes = 15 * 60; // 15 minutes in seconds
    let swnft: any;

    const gameData = {
        description: "Champions League Final",
        name: "CL Final 2023",
        url: "https://example.com/games/cl-final-2023",
        image: "https://example.com/images/cl-final-2023.jpg",
        eventId: 1, // Unique identifier for the game
        eventDate: Math.floor(Date.now() / 1000) + 86400, // Unix timestamp, e.g., 24 hours from now
        datasource: "https://api.example.com/games/cl-final-2023",
        active: true
    };
    beforeEach(async function () {
        [owner, addr1, forwarder] = await ethers.getSigners();
        const StakeWiseWhitelistNFT = await ethers.getContractFactory("StakeWiseWhitelistNFT");
        const whitelist = await StakeWiseWhitelistNFT.deploy();

        const SWNFT = await ethers.getContractFactory("SWNFT");
        swnft = await SWNFT.deploy(await whitelist.getAddress());

        const StakeWiseWagerService = await ethers.getContractFactory("StakeWiseWagerService");
        wagerService = await StakeWiseWagerService.deploy(await swnft.getAddress(), owner.address);
        await swnft.transferOwnership(await wagerService.getAddress());
        await wagerService.setForwarder(forwarder.address);
    });

    describe("createGameConfig", function () {
        it("should allow the owner to create a new game configuration", async function () {
            await expect(wagerService.createGameConfig({ ...gameData, eventId: gameId }))
                .to.emit(wagerService, "GameCreated") // Assuming you have a GameCreated event
                .withArgs(gameId);

            const game = await wagerService.findGameById(gameId);
            expect(game.eventId).to.equal(gameId);
        });

        it("should prevent creating a game with an existing ID", async function () {
            await wagerService.createGameConfig({ ...gameData, eventId: gameId });
            await expect(wagerService.createGameConfig({ ...gameData, eventId: gameId }))
                .to.be.revertedWith("cannot create game, it already exists");
        });

        it("should only allow the owner to create a game", async function () {
            await expect(wagerService.connect(addr1).createGameConfig({ ...gameData, eventId: gameId }))
                .to.be.revertedWithCustomError(wagerService, "OwnableUnauthorizedAccount");
        });

        it("should prevent creating a game with invalid parameters (e.g., inactive game)", async function () {
            await expect(wagerService.createGameConfig({ ...gameData, eventId: gameId, active: false }))
                .to.be.reverted; // Update with specific revert message if applicable
        });

        it("should not allow a game to be created where the time is already expired", async function () {
            const gameData = {
                description: "Champions League Final",
                name: "CL Final 2023",
                url: "https://example.com/games/cl-final-2023",
                image: "https://example.com/images/cl-final-2023.jpg",
                eventId: 1, // Unique identifier for the game
                eventDate: Math.floor(Date.now() / 1000) - 86400, // Unix timestamp, e.g., 24 hours from now
                datasource: "https://api.example.com/games/cl-final-2023",
                active: true
            };

            await expect(wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true }))
                .to.be.revertedWith("created game config event date must be after current time"); // Update with specific revert message if applicable

        });
    });

    describe("createWager", function () {
        // Implement test cases for createWager
        // ...
        it("should allow creating a wager for an existing and active game", async function () {
            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });
            await expect(wagerService.createWager(gameData.eventId))
                .to.emit(wagerService, "WagerCreated") // Assuming you have a WagerCreated event
                .withArgs(gameData.eventId, owner.address);
            // Additional assertions to check the state after wager creation
        });

        it("should prevent creating a wager for a non-existent game", async function () {
            const nonExistentGameId = 9999;
            await expect(wagerService.createWager(nonExistentGameId))
                .to.be.revertedWith("cannot create wager, event id does not exist");
        });

        it("should prevent creating a wager for an inactive game", async function () {
            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });
            await wagerService.cancelGame(gameData.eventId);
            await expect(wagerService.createWager(gameData.eventId))
                .to.be.revertedWith("game is no longer active");
        });

        it("should prevent creating a wager if the game is about to begin", async function () {
            const gameData = {
                description: "Champions League Final",
                name: "CL Final 2023",
                url: "https://example.com/games/cl-final-2023",
                image: "https://example.com/images/cl-final-2023.jpg",
                eventId: 1, // Unique identifier for the game
                eventDate: Math.floor(Date.now() / 1000) + 86400, // Unix timestamp, e.g., 24 hours from now
                datasource: "https://api.example.com/games/cl-final-2023",
                active: true
            };
            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });

            await ethers.provider.send("evm_increaseTime", [86400])
            await expect(wagerService.createWager(gameData.eventId))
                .to.be.revertedWith("cannot create wager where event is about to begin");

            await ethers.provider.send("evm_increaseTime", [-86400])

        });
    });

    describe("cancelGame", function () {
        const gameData = {
            description: "Champions League Final",
            name: "CL Final 2023",
            url: "https://example.com/games/cl-final-2023",
            image: "https://example.com/images/cl-final-2023.jpg",
            eventId: 1, // Unique identifier for the game
            eventDate: Math.floor(Date.now() / 1000) + 864000, // Unix timestamp, e.g., 24 hours from now
            datasource: "https://api.example.com/games/cl-final-2023",
            active: true
        };

        it("should allow the owner to cancel an active game", async function () {
            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });

            await expect(wagerService.cancelGame(gameData.eventId))
                .to.emit(wagerService, "GameCancelled") // Assuming you have a GameCanceled event
                .withArgs(gameData.eventId);

            const game = await wagerService.findGameById(gameData.eventId);
            expect(game.active).to.be.false;
        });

        it("should prevent canceling a game that does not exist", async function () {
            const nonExistentGameId = 9999;
            await expect(wagerService.cancelGame(nonExistentGameId))
                .to.be.revertedWith("game already cancelled");
        });

        it("should prevent non-owners from canceling a game", async function () {
            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });

            await expect(wagerService.connect(addr1).cancelGame(gameData.eventId))
                .to.be.revertedWithCustomError(wagerService, "OwnableUnauthorizedAccount");
        });

        it("should prevent canceling an already canceled game", async function () {
            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });

            await wagerService.cancelGame(gameData.eventId);
            await expect(wagerService.cancelGame(gameData.eventId))
                .to.be.revertedWith("game already cancelled");
        });
    });

    describe("updateGameResult(s)", function () {
        const gameData = {
            description: "Champions League Final",
            name: "CL Final 2023",
            url: "https://example.com/games/cl-final-2023",
            image: "https://example.com/images/cl-final-2023.jpg",
            eventId: 1, // Unique identifier for the game
            eventDate: Math.floor(Date.now() / 1000) + 3 * 864000, // Unix timestamp, e.g., 24 hours from now
            datasource: "https://api.example.com/games/cl-final-2023",
            active: true
        };
        const result = 1;

        it("should allow the result source to update a game result", async function () {
            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });
            // Assuming resultSource is the address set as the result source
            await wagerService.updateGameResult(gameData.eventId, result);
            // Verify the result is updated in the game or NFT contract
        });

        it("should prevent unauthorized addresses from updating game results", async function () {
            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });
            await expect(wagerService.connect(addr1).updateGameResult(gameData.eventId, result))
                .to.be.revertedWith("only the result source can call update game result");
        });

        it("should prevent updating results for non-existent games", async function () {
            const nonExistentGameId = 9999;
            await expect(wagerService.updateGameResult(nonExistentGameId, result))
                .to.be.revertedWith("game does not exist");
        });

        it("should prevent updating results for inactive games", async function () {
            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true });

            await wagerService.cancelGame(gameData.eventId);
            await expect(wagerService.updateGameResult(gameData.eventId, result))
                .to.be.revertedWith("game is no longer active");
        });
    });

    describe("checkUpkeep", function () {
        const gameData = {
            description: "Champions League Final",
            name: "CL Final 2023",
            url: "https://example.com/games/cl-final-2023",
            image: "https://example.com/images/cl-final-2023.jpg",
            eventId: 1, // Unique identifier for the game
            eventDate: Math.floor(Date.now() / 1000) + 900, // Unix timestamp, e.g., 24 hours from now
            datasource: "https://api.example.com/games/cl-final-2023",
            active: true
        };

        it("should indicate no upkeep is needed if there are no active games", async function () {
            const [needsUpkeep] = await wagerService.checkUpkeep("0x");
            expect(needsUpkeep).to.equal(false);
        });

        it("should indicate upkeep is needed if there are active games", async function () {
            // Create a game configuration
            const currentTime = (await ethers.provider.getBlock('latest')).timestamp;
            const gameEventTime = currentTime + fifteenMinutes; // 15 minutes from now
            const mockGame = { ...gameData, eventDate: gameEventTime };

            await wagerService.createGameConfig(mockGame);

            // Create a wager to activate the game
            await wagerService.createWager(mockGame.eventId);

            // Simulate time passage to align with the game's event time
            await ethers.provider.send("evm_increaseTime", [fifteenMinutes]);
            await ethers.provider.send("evm_mine");

            // Check upkeep
            const [needsUpkeep] = await wagerService.checkUpkeep("0x");
            expect(needsUpkeep).to.be.true;

            await ethers.provider.send("evm_increaseTime", [fifteenMinutes]);
            await ethers.provider.send("evm_mine");

            const [needsUpkeep2] = await wagerService.checkUpkeep("0x");
            expect(needsUpkeep2).to.be.false;

        });
    });

    describe("performUpkeep", function () {
        it("should allow the forwarder to perform upkeep", async function () {
            // at this point we need to re-build to test end to end
            const StakeWiseWhitelistNFT = await ethers.getContractFactory("StakeWiseWhitelistNFT");
            const whitelist = await StakeWiseWhitelistNFT.deploy();

            const Vrf = await ethers.getContractFactory("VRFCoordinatorV2Mock");
            const vrfCoordinatorMock = await Vrf.deploy("100000000000000000", 1000000000);
            const tx = await vrfCoordinatorMock.createSubscription();
            const receipt = await tx.wait();

            await (await vrfCoordinatorMock.fundSubscription(1, "10000000000000000000")).wait();

            // // Deploy StakeWiseRandom with the mock addresses
            const StakeWiseRandom = await ethers.getContractFactory("StakeWiseRandom");
            const stakeWiseRandom = await StakeWiseRandom.deploy(1, await vrfCoordinatorMock.getAddress(), "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc");
            await vrfCoordinatorMock.addConsumer(1, await stakeWiseRandom.getAddress());

            const SWNFT = await ethers.getContractFactory("SWNFT");
            const swnft = await SWNFT.deploy(await whitelist.getAddress());

            const StakeWiseWagerService = await ethers.getContractFactory("StakeWiseWagerService");
            const wagerService = await StakeWiseWagerService.deploy(await swnft.getAddress(), await stakeWiseRandom.getAddress());
            await swnft.transferOwnership(await wagerService.getAddress());
            await wagerService.setForwarder(forwarder.address);

            const currentTime = (await ethers.provider.getBlock('latest')).timestamp;
            const gameEventTime = currentTime + fifteenMinutes; // 15 minutes from now

            stakeWiseRandom.transferOwnership(await wagerService.getAddress());

            await wagerService.createGameConfig({ ...gameData, eventId: gameId, active: true, eventDate: gameEventTime });
            await wagerService.createWager(gameData.eventId);

            await ethers.provider.send("evm_increaseTime", [fifteenMinutes]);
            await ethers.provider.send("evm_mine");

            await expect(wagerService.connect(forwarder).performUpkeep("0x"))
                .to.emit(wagerService, "UpkeepPerformed"); // Assuming an event is emitted

            // check stakewise random
            expect((await stakeWiseRandom.getGamesByTimestamp(await wagerService.roundToNearestFifteenMinutes(gameEventTime)))[0]).eq(BigInt(1));

            // generate random number and then check results
            await vrfCoordinatorMock.fulfillRandomWordsWithOverride(1, await stakeWiseRandom.getAddress(), [1]);

            expect(await swnft.stakeWiseResults(1)).eq(2)

        });

        it("should prevent non-forwarders from performing upkeep", async function () {
            await expect(wagerService.connect(addr1).performUpkeep("0x"))
                .to.be.revertedWith("not forwarder cannot call find game results");
        });

        it("should not perform upkeep if there are no active games", async function () {
            await expect(wagerService.connect(forwarder).performUpkeep("0x"))
                .not.to.emit(wagerService, "GameCreated")
        });
    });

    describe("test fifteenminutes function", async function () {
        it("should not change a timestamp that is exactly on a fifteen-minute mark", async function () {
            const timestamp = 8 * 60 * 60; // 08:00
            expect(await wagerService.roundToNearestFifteenMinutes(timestamp)).to.equal(timestamp);
        });

        it("should round up a timestamp just before a fifteen-minute mark", async function () {
            const timestamp = 8 * 60 * 60 + 14 * 60; // 08:14
            const expected = timestamp + 60; // Rounded to 08:15
            expect(await wagerService.roundToNearestFifteenMinutes(timestamp)).to.equal(expected);
        });

        it("should round down a timestamp just after a fifteen-minute mark", async function () {
            const timestamp = 8 * 60 * 60 + 16 * 60; // 08:16
            const expected = timestamp - 60; // Rounded to 08:15
            expect(await wagerService.roundToNearestFifteenMinutes(timestamp)).to.equal(expected);
        });

        it("should correctly round a timestamp halfway between fifteen-minute marks", async function () {
            const timestamp = 8 * 60 * 60 + 7 * 60 + 30; // 08:07:30
            const expected = 8 * 60 * 60; // Rounded to 08:00
            expect(await wagerService.roundToNearestFifteenMinutes(timestamp)).to.equal(expected);
        });
    });
});

