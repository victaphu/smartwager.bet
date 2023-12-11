import Image from "next/image";
import { useEffect, useState } from "react";
import Select from "../select/Select";
import down_arrow from "/public/images/icon/down-arrow.png";
import up_arrow from "/public/images/icon/up-arrow.png";
import { format } from "date-fns";
import { erc721ABI, useAccount, useContractRead } from "wagmi";
import common, { stakeWiseWager } from "../common/common";
import { polygonMumbai } from "viem/chains";
import { createPublicClient, decodeEventLog, http } from "viem";
import { ethers } from "ethers";
import { waitForTransaction, prepareWriteContract, writeContract } from "@wagmi/core";
import { useFetchActiveGames } from "@/data/ganeData";
import useFetchGameNFTs from "../hooks/useFetchGameNFTs";

const img1 = "https://i.seadn.io/gcs/files/2c41369cdfb2323fe991443e0df7b930.png?auto=format&dpr=1&w=1000";
const img2 = "https://i.seadn.io/gae/qw71kH-wuhbe9rz8r7zOEbDawJG8X28-MRqv5NIMjMZEq8js3ED6URNlq0hdF1WkUifWM-ohusyU279CgDJD-A7954btXfgHl4wNQA?auto=format&dpr=1&w=384"
const img3 = "https://i.seadn.io/gae/q-fC12J8lmyWjhcEbGo2JfytMpTS_itVr1f5qquzWfKkEHs6ZQ1tXcDPMkcTDLirNmm_swqMnInoeoPhbVs3xxMsyEHGNnU1L85UOQ?auto=format&dpr=1&w=384";
const img4 = "https://i.seadn.io/s/raw/files/3230d3df052fd216c9f052f051d598f3.jpg?auto=format&dpr=1&w=384";
const img5 = "https://i.seadn.io/gcs/files/ec21953349ca626831960e5380ec7060.png?auto=format&dpr=1&w=384";
const img6 = "https://i.seadn.io/gcs/files/1cf483f4afd3e0b142a4a80056e1966c.png?auto=format&dpr=1&w=384";
const img7 = "https://i.seadn.io/gcs/files/42c04f143de56914b52fae6c6e3c3224.png?auto=format&dpr=1&w=384";
const img8 = "https://i.seadn.io/gcs/files/2568c6b35e5a589ec99bf7602ff5ece6.png?auto=format&dpr=1&w=1000";
const img9 = "https://i.seadn.io/gcs/files/54935d47dad5c21e797ea4510d85acbf.png?auto=format&dpr=1&w=1000";
const img10 = "https://i.seadn.io/gcs/files/2ca5824b8043a9c0ba22662d08c8a06c.png?auto=format&dpr=1&w=1000";

const mapping = [img6, img7, img8, img9, img10, img1, img2, img3, img4, img5];

function getRandomImage() {
  return mapping[Math.floor(Math.random() * mapping.length)];
}

const emptySlot = "images/join.png";

function Card({game, i, home, away}) {
  const homeImage = game.p1Position === BigInt(1) || game.p2Position === BigInt(1) ? getRandomImage() : emptySlot;
  const awayImage = game.p1Position === BigInt(2) || game.p2Position === BigInt(2) ? getRandomImage() : emptySlot;
  
  const homePlayer = game.p1Position === BigInt(1) ? game.p1Player : game.p2Position === BigInt(1) ? game.p2Player : undefined;
  const awayPlayer = game.p1Position === BigInt(2) ? game.p1Player : game.p2Position === BigInt(2) ? game.p2Player : undefined;

  return (<div style={{ "padding": "20px", "backgroundColor": i % 2 ? "blue" : "navy" }} key={i}>
    <h4>Game dNFT {game.id}</h4>
    <div className="main-content top-item">
      <div className="team-single">
        <span className="mdr">Home</span>
        <div className="img-area text-center" style={{ "width": "200px" }}>
          <img onClick={() => !game.player1 && updateGame(game.gameId, true)} src={homeImage} alt="image" />
          {!homePlayer ? <button className="btn btn-primary">{home} to win</button> : homePlayer}
        </div>
      </div>

      <div className="team-single">
        <span className="mdr">Away</span>
        <div className="img-area text-center" style={{ "width": "200px" }}>
          <img onClick={() => !game.player2 && updateGame(game.gameId, false)} src={awayImage} alt="image" />
          {!awayPlayer ? <button className="btn btn-primary">{away} to win</button> : awayPlayer}
        </div>
      </div>
    </div>
  </div>)
}

const BetpopUpModal = () => {
  const [odd, setOdd] = useState(1.5);
  const [betValue, setBetValue] = useState(0.1);
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [gameId, setGameId] = useState("");
  const [eventDate, setEventDate] = useState(0);
  // const [games, setGames] = useState(_games);
  const [nfts, setNfts] = useState([]);
  const [tokenId, setTokenId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const { address } = useAccount();

  const { fetchGames, games, } = useFetchGameNFTs();

  const getListNFTs = async () => {
    const client = createPublicClient({
      chain: polygonMumbai,
      transport: http()
    });

    const nfts = [];

    const total = 100;

    const balance = await client.readContract({
      address: common.claimNote,
      abi: erc721ABI,
      functionName: "balanceOf",
      args: [address || common.sampleNft]
    });

    const offset = 0;

    for (let i = 0; i < Number(total) && balance > 0; ++i) {
      try {
        const owner = await client.readContract({
          address: common.claimNote,
          abi: erc721ABI,
          functionName: "ownerOf",
          args: [i + offset]
        });

        if (owner === ethers.ZeroAddress) {
          console.log("NFT rejected")
          break;
        }

        if (owner === address) {
          nfts.push({ id: i + offset, name: "NFT " + i });
        }

        if (balance === nfts.length) {
          break; // break if we found all the nfts
        }
      }
      catch (e) {
        console.log(e);
        break;
      }
    }

    setNfts(nfts);

    if (nfts.length > 0) {
      setTokenId(nfts[0].id);
    }

    return nfts;
  }

  const updateGame = (gameId, p1) => {
    const game = games.find(e => e.gameId === gameId);

    if (p1 && !game.player1) {
      game.p1 = mapping[(idx++) & mapping.length];
      game.player1 = true;
    }
    if (!p1 && !game.player2) {
      game.p2 = mapping[(idx++) & mapping.length];
      game.player2 = true;
    }
    setGames([...games]);
  }

  useEffect(() => {
    getListNFTs();
    const handler = (e) => {
      console.log(e.relatedTarget.dataset);
      setHome(e.relatedTarget.dataset.home);
      setAway(e.relatedTarget.dataset.away);
      setGameId(e.relatedTarget.dataset.id);
      setEventDate(+e.relatedTarget.dataset.eventdate);

      fetchGames();
    };
    document.getElementById('betpop-up').addEventListener('show.bs.modal', handler);

    return () => {
      document.getElementById('betpop-up').removeEventListener('show.bs.modal', handler);
    }
  }, []);

  async function confirmWager(selection) {

    setLoading(true);

    try {
      const sel = selection === 1 ? home : away;
      if (!confirm(`Are you sure you want to wager NFT ${tokenId} that ${sel} will win?`)) {
        return;
      }

      const request = await prepareWriteContract({
        address: common.wager,
        abi: stakeWiseWager,
        functionName: "createWager",
        args: [gameId]
      });

      // create game
      const receipt = await waitForTransaction(await writeContract(request.request));
      console.log('Game Created successfully', receipt);

      const logs = receipt.logs.map(l => {
        try {
          return decodeEventLog({ ...l, abi: erc721ABI })
        } catch (e) {
          return {};
        }
      }).find(e => e.eventName === 'Transfer');
      console.log(logs);

      // transfer NFT
      // await sampleERC721.connect(player1)['safeTransferFrom(address,address,uint256,bytes)'](player1.address, swnftAddress, 1, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [gameId, 1]));

      // gameId should be replaced with NFT ID, which is the newly minted NFT
      // we get this probably from the Transfer event
      console.log(receipt.logs);
      const request2 = await prepareWriteContract({
        address: common.claimNote,
        abi: erc721ABI,
        functionName: "safeTransferFrom",
        args: [address, common.swnft, tokenId, ethers.AbiCoder.defaultAbiCoder().encode(["uint256", "uint256"], [logs?.args?.tokenId || 0, selection])]
      });

      const receipt2 = await waitForTransaction(await writeContract(request.request));
      console.log('NFT Transfer was successful!', receipt2);
    }
    catch (e) {
      console.log('error', e);
    }
    finally {
      setLoading(false);
    }

    setShowCreate(false);
  }

  const activeGames = games.filter(g => g.gameId === BigInt(gameId));

  return (
    <div className="betpopmodal">
      <div
        className="modal fade"
        id="betpop-up"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-8 col-xl-9 col-lg-11">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setShowCreate(false);
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="top-item">
                      <button className="cmn-btn firstTeam">
                        {home} will win
                      </button>
                      <button className="cmn-btn greenbutton" onClick={() => {
                        if (nfts.length === 0) {
                          window.location.href = "/dashboard";
                          return;
                        }
                        setShowCreate(true);
                      }}>
                        {nfts.length > 0 ? "Create Wager!" : "Bridge NFT"}
                      </button>
                      <button className="cmn-btn lastTeam">
                        {away} will win
                      </button>
                    </div>
                    {!loading && showCreate && <div className="top-item">
                      <button className="cmn-btn greenbutton" onClick={() => confirmWager(1)}>{home} to Win</button>
                      <div>
                        <p>Select Nft to wager</p>
                        {nfts.length > 0 && <Select data={nfts} onChange={(e) => setTokenId(e.id)} />}</div>
                      <button className="cmn-btn greenbutton" onClick={() => confirmWager(2)}>{away} to Win</button>
                    </div>}

                    {
                      loading && showCreate && <div className="top-item">
                        <div className="spinner-border text-primary" role="status">
                          <span className="sr-only "></span>
                        </div>
                        <p>Processing Wager!</p>
                      </div>}


                    <div style={{ "display": "flex", "flexDirection": "column", "maxHeight": "500px", "overflowY": "scroll" }}>
                      {activeGames.map((game, i) => {
                        return (<Card i={i} game={game} home={home} away={away}/>)
                      })}
                      {activeGames.length === 0 && <h4>No active NFTs</h4>}
                    </div>
                    <div className="bottom-area">
                      <div className="bottom-right">
                        <p>Game Closes:</p>
                        <p className="date-area">
                          {eventDate > 0 && format(new Date(eventDate), "PPP ppp")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetpopUpModal;
