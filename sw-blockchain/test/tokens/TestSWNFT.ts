export { }
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SWNFT Contract Game Play", function () {
  let SampleERC721;
  let sampleERC721: any;
  let SWNFT: any;
  let swnft: any;
  let owner: any;
  let player1: any;
  let player2: any;
  let addrs: Array<string>;
  let whitelist: any;

  let swnftAddress: string;

  beforeEach(async function () {
    // Deploy SampleERC721 for the test
    SampleERC721 = await ethers.getContractFactory("SampleERC721");
    sampleERC721 = await SampleERC721.deploy();

    const StakeWiseWhitelistNFT = await ethers.getContractFactory("StakeWiseWhitelistNFT");
    whitelist = await StakeWiseWhitelistNFT.deploy();

    // Mint NFTs to player1 and player2
    [owner, player1, player2, ...addrs] = await ethers.getSigners();
    await sampleERC721.connect(player1).mintToken();
    await sampleERC721.connect(player2).mintToken();

    // Deploy SWNFT
    SWNFT = await ethers.getContractFactory("SWNFT");
    swnft = await SWNFT.deploy(await whitelist.getAddress());

    swnftAddress = await swnft.getAddress();
    whitelist.addWhitelistContract(await sampleERC721.getAddress())
  });

  it("should play a game end-to-end", async function () {
    // Mint a new game
    const gameId = 1;
    await swnft.connect(owner).mint(player1.address, gameId);

    // Players transfer their NFTs to the SWNFT contract
    await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
    await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

    // Player 2 tries to accept the game
    await expect(swnft.connect(player2).accept(gameId)).to.be.revertedWith('not owner of wager');

    // Player 1 accepts the game
    await swnft.connect(player1).accept(gameId);

    await expect(swnft.connect(player2).claim(gameId)).to.be.revertedWith('game not completed');
    // Owner updates the game result
    const result = 1; // Assuming player 1 wins
    await swnft.connect(owner).updateResult(gameId, result);

    await expect(swnft.connect(owner).claim(gameId)).to.be.revertedWith('not players');
    await expect(swnft.connect(player2).claim(gameId)).to.be.revertedWith('not winner');
    // Winner (player 1) claims the NFTs
    await swnft.connect(player1).claim(gameId);

    // Verify game state and NFT ownership
    const game = await swnft.results(gameId);
    expect(game.started).to.equal(3); // GameState.COMPLETED

    const ownerOfNFT1 = await sampleERC721.ownerOf(1);
    const ownerOfNFT2 = await sampleERC721.ownerOf(2);
    expect(ownerOfNFT1).to.equal(player1.address);
    expect(ownerOfNFT2).to.equal(player1.address);
  });


  describe("accept function", function () {
    it("should successfully accept a game in pending state", async function () {
      // Mint a new game by the owner
      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Pre-conditions setup: simulate both players having sent their tokens and player2 accepted the game
      // Assuming there are methods to set these conditions in your contract or you do it through direct interactions
      // For instance, sending NFTs to the contract and updating game struct accordingly
      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      // Player 1 tries to accept the game
      await swnft.connect(player1).accept(gameId);

      // Fetch the game state to verify if it's started
      const game = await swnft.results(gameId);
      expect(game.started).to.equal(1); // 1 represents GameState.STARTED
    });

    it("should revert if player2 is not set when accepting the game", async function () {
      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);
      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));

      // Ensure player2 is not set
      // ...

      await expect(swnft.connect(player1).accept(gameId)).to.be.revertedWith("waiting for p2 to send token");
    });
    it("should revert if player1's token is not set", async function () {
      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Ensure p1TokenAddress is not set
      // ...

      await expect(swnft.connect(player1).accept(gameId)).to.be.revertedWith("waiting for p1 to send token");
    });
    it("should revert if player2's token is not set", async function () {
      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);
      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));

      // Ensure p2TokenAddress is not set
      // ...

      await expect(swnft.connect(player1).accept(gameId)).to.be.revertedWith("waiting for p2 to send token");
    });
    it("should revert if trying to accept a game that is already completed", async function () {
      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Set game result to indicate completion
      // ...
      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      // Player 2 tries to accept the game
      await expect(swnft.connect(player2).accept(gameId)).to.be.revertedWith('not owner of wager');

      // Player 1 accepts the game
      await swnft.connect(player1).accept(gameId);

      await expect(swnft.connect(player2).claim(gameId)).to.be.revertedWith('game not completed');
      // Owner updates the game result
      const result = 1; // Assuming player 1 wins
      await swnft.connect(owner).updateResult(gameId, result);


      await expect(swnft.connect(player1).accept(gameId)).to.be.revertedWith("already started");
    });
    it("should revert if a non-token owner tries to accept the game", async function () {
      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Setup preconditions for the game
      // ...

      await expect(swnft.connect(player2).accept(gameId)).to.be.revertedWith("not owner of wager");
    });

  });

  describe("updateResult function", function () {
    it("should update the result of a started game", async function () {
      // Setup a game in STARTED state
      // ...

      const gameId = 1;
      const result = 1; // Valid result
      await swnft.connect(owner).mint(player1.address, gameId);

      // Player 1 accepts the game
      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await swnft.connect(player1).accept(gameId);
      
      // the owner can update the shared game results, but only once\
      await expect(swnft.connect(owner).updateResult(gameId, 0)).to.be.revertedWith("invalid result, must be greater than 0");
      await swnft.connect(owner).updateResult(gameId, result)
      await expect(swnft.connect(owner).updateResult(gameId, result)).to.be.revertedWith('result already captured');

      // await swnft.connect(owner).updateResult(gameId, result);

      let game = await swnft.results(gameId);
      expect(game.started).to.equal(1); // 3 represents GameState.COMPLETED
      await swnft.connect(player1).claim(gameId);
      game = await swnft.results(gameId);
      expect(game.started).to.equal(3); // 3 represents GameState.COMPLETED
      game = await swnft.stakeWiseResults(gameId);
      expect(game).to.equal(result);
    });

    it("should revert if game is not started", async function () {
      // Setup a game in a state other than STARTED
      // ...

      const gameId = 1;
      const result = 1;

      await expect(swnft.connect(owner).updateResult(gameId, result)).not.to.be.reverted
    });

    it("should revert if result is invalid", async function () {
      // Setup a game in STARTED state
      // ...

      const gameId = 1;
      const invalidResult = 0;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Player 1 accepts the game
      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));
      await swnft.connect(player1).accept(gameId);

      await expect(swnft.connect(owner).updateResult(gameId, invalidResult))
        .to.be.revertedWith('invalid result, must be greater than 0');
    });

    it("should revert if non-owner tries to update result", async function () {
      // Setup a game in STARTED state
      // ...

      const gameId = 1;
      const result = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Player 1 accepts the game
      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));
      await swnft.connect(player1).accept(gameId);

      // await swnft.connect(player1).updateResult(gameId, result);
      await expect(swnft.connect(player1).updateResult(gameId, result))
        .to.be.revertedWithCustomError(swnft, "OwnableUnauthorizedAccount");
    });
  });


  describe("cancel function", function () {
    it("should allow the token owner to cancel a game successfully", async function () {
      // Setup a game in PENDING state
      // ...

      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      expect(await sampleERC721.ownerOf(1)).eq(swnftAddress);
      expect(await sampleERC721.ownerOf(2)).eq(swnftAddress);

      await swnft.connect(player1).cancel(gameId);
      expect(await sampleERC721.ownerOf(1)).eq(player1.address);
      expect(await sampleERC721.ownerOf(2)).eq(player2.address);

    });

    it("should revert if the game has already started", async function () {
      // Setup a game in STARTED state
      // ...
      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);


      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));
      await swnft.connect(player1).accept(gameId);
      await expect(swnft.connect(player1).cancel(gameId))
        .to.be.revertedWith("cannot cancel game started");
    });

    it("should revert if a non-token owner tries to cancel the game", async function () {
      // Setup a game in PENDING state
      // ...

      const gameId = 1;
      await expect(swnft.connect(player2).cancel(gameId))
        .to.be.revertedWith("not owner of wager");
    });
  });
  describe("decline function", function () {
    it("should allow the token owner to decline a game successfully", async function () {
      // Setup a game in PENDING state
      // ...

      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);


      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));
      await swnft.connect(player1).accept(gameId);
      await swnft.connect(player1).decline(gameId);

      // Assert game state and NFT ownership
      // ...
    });

    it("should revert if the game has already started", async function () {
      // Setup a game in STARTED state
      // ...
      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);


      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await expect(swnft.connect(player1).decline(gameId))
        .to.be.revertedWith("cannot decline game started");
    });

    it("should revert if a non-token owner tries to decline the game", async function () {
      // Setup a game in PENDING state
      // ...

      const gameId = 1;
      await expect(swnft.connect(player2).decline(gameId))
        .to.be.revertedWith("not owner of wager");
    });
  });

  describe("claim function", function () {
    it("should allow the winner to claim the winnings successfully", async function () {
      // Setup a completed game where player1 is the winner
      // ...

      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await swnft.connect(player1).accept(gameId);
      const result = 1; // Assuming player 1 wins
      await swnft.connect(owner).updateResult(gameId, result);

      await swnft.connect(player1).claim(gameId);

      // Assert NFT ownership and other post-claim conditions
      // ...
    });

    it("should revert if the game is not completed", async function () {
      // Setup a game in a non-completed state
      // ...


      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await swnft.connect(player1).accept(gameId);
      const result = 1; // Assuming player 1 wins
      // await swnft.connect(owner).updateResult(gameId, result);

      await expect(swnft.connect(player1).claim(gameId))
        .to.be.revertedWith("game not completed");
    });

    it("should revert if a non-participant tries to claim", async function () {
      // Setup a completed game
      // ...

      const gameId = 1;
      await expect(swnft.connect(addrs[0]).claim(gameId)) // addrs[0] is neither player1 nor player2
        .to.be.revertedWith("not players");
    });

    it("should revert if the loser tries to claim", async function () {
      // Setup a completed game where player1 is the winner and player2 is the loser
      // ...

      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await swnft.connect(player1).accept(gameId);
      const result = 1; // Assuming player 1 wins
      await swnft.connect(owner).updateResult(gameId, result);
      await expect(swnft.connect(player2).claim(gameId))
        .to.be.revertedWith("not winner");
    });

    it("should revert if the winner tries to claim with incorrect position value", async function () {
      // Setup a completed game where player1's position value does not match the result
      // ...
      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);
      await swnft.connect(owner).mint(player1.address, gameId + 1);


      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await swnft.connect(player1).accept(gameId);
      const result = 1; // Assuming player 1 wins
      await swnft.connect(owner).updateResult(gameId, result);

      await sampleERC721.connect(player1).mintToken();
      await sampleERC721.connect(player2).mintToken();

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 3, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [2, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 4, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [2, 2]));


      await swnft.connect(player1).accept(2);
      await swnft.connect(owner).updateResult(2, 2);

      await expect(swnft.connect(player1).claim(2))
        .to.be.revertedWith("not winner");
    });
  });

  describe("onERC721Received function", function () {
    it("should handle receiving a token for a valid game correctly", async function () {
      // Setup a valid game in PENDING state
      // ...

      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);

      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await swnft.connect(player1).accept(gameId);
      const result = 1; // Assuming player 1 wins
      await swnft.connect(owner).updateResult(gameId, result);

      expect(await sampleERC721.ownerOf(1)).eq(swnftAddress);
      expect(await sampleERC721.ownerOf(2)).eq(swnftAddress);
      await swnft.connect(player1).claim(gameId);

      expect(await sampleERC721.ownerOf(1)).eq(player1.address);
      expect(await sampleERC721.ownerOf(2)).eq(player1.address);
    });

    it("should revert if the NFT contract is not whitelisted", async function () {
      // Attempt to send an NFT from a non-whitelisted contract
      // ...

      const gameId = 1;
      const tokenId = 1;
      await expect(swnft.onERC721Received(owner.address, owner.address, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [2, 1]))).to.be.revertedWith("invalid whitelist");
    });

    it("should revert if the game ID is invalid", async function () {
      // Attempt to send an NFT for an invalid game
      // ...

      const invalidGameId = 999;
      const tokenId = 1;
      await swnft.connect(owner).mint(player1.address, 1);
      await whitelist.addWhitelistContract(owner.address)
      await expect(swnft.onERC721Received(owner.address, owner.address, invalidGameId, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [2, 1]))).to.be.revertedWith("invalid game");
    });

    it("should revert if the game has already started", async function () {
      // Setup a game in STARTED state
      // ...

      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);
      // Assert game state and NFT ownership
      // ...
      await whitelist.addWhitelistContract(owner.address)
      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await swnft.connect(player1).accept(gameId);
      await expect(swnft.onERC721Received(owner.address, owner.address, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [1, 1]))).to.be.revertedWith("game already started");
    });

    it("should revert if a player tries to send a second token for the same game", async function () {
      // Setup a game where player1 has already sent a token
      // ...

      await sampleERC721.connect(player1).mintToken();

      const gameId = 1;
      const tokenId = 2; // Second token ID
      await swnft.connect(owner).mint(player1.address, gameId);
      // Assert game state and NFT ownership
      // ...
      await whitelist.addWhitelistContract(owner.address)
      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      
      // await swnft.connect(player1).accept(gameId);
      await expect(sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 3, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2])))
        .to.be.revertedWith("p1 already defined");

      await expect(sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1])))
        .to.be.revertedWith("cannot be same as p1");
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));
    });

    it("should revert if a player tries to send a second token for the same game p1 choice can't be same as p2", async function () {
      // Setup a game where player1 has already sent a token
      // ...

      await sampleERC721.connect(player1).mintToken();

      const gameId = 1;
      const tokenId = 2; // Second token ID
      await swnft.connect(owner).mint(player1.address, gameId);
      // Assert game state and NFT ownership
      // ...
      await whitelist.addWhitelistContract(owner.address)
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await expect(sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2])))
        .to.be.revertedWith("cannot be same as p2");;
    });
  });

  describe("Test being able to transfer token around", function() {
    it("should only allow nft transfer on complete", async function () {
      // Setup a valid game in PENDING state
      // ...

      const gameId = 1;
      await swnft.connect(owner).mint(player1.address, gameId);
      await expect(swnft.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [0, 1])))
        .to.be.revertedWith("cannot transfer until game is completed");

      // Assert game state and NFT ownership
      // ...

      await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));
      await sampleERC721.connect(player2)['safeTransferFrom(address,address,uint256,bytes)'](player2.address, swnftAddress, 2, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 2]));

      await swnft.connect(player1).accept(gameId);
      await expect(swnft.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [0, 1])))
        .to.be.revertedWith("cannot transfer until game is completed");
      const result = 1; // Assuming player 1 wins

      await swnft.connect(owner).updateResult(gameId, result);

      expect(await sampleERC721.ownerOf(1)).eq(swnftAddress);
      expect(await sampleERC721.ownerOf(2)).eq(swnftAddress);
      await swnft.connect(player1).claim(gameId);

      expect(await sampleERC721.ownerOf(1)).eq(player1.address);
      expect(await sampleERC721.ownerOf(2)).eq(player1.address);

      await swnft.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, owner.address, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [0, 1]));
      expect(await swnft.ownerOf(1)).eq(owner.address);
    });

  })

});