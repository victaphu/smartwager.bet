import gameData, { useFetchGames } from "@/data/ganeData";
import Link from "next/link";
import GameCard from "../cards/GameCard";
import { useEffect } from "react";
import { readContract } from "@wagmi/core";
import common from "../common/common";
import Image from "next/image";

const Bet = () => {
  const {data, read} = useFetchGames();

  return (
    <section className="bet-this-game">
      <div className="overlay pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="section-header text-center">
                <h5 className="sub-title">Multi-Chain NFT Wager</h5>
                <h2 className="title">Wager in This Game</h2>
                <p>
                  Use Chainlink CCIP and Token Escrow Service to bring your favourite NFTs with you
                </p>
              </div>
            </div>
          </div>
          <div className="row cus-mar">
            {data?.map((itm) => (
              <div key={itm.id} className="col-lg-6">
                <GameCard itm={itm} />
              </div>
            ))}
          </div>
          {/* <div className="row">
            <div className="col-lg-12 d-flex justify-content-center">
              <div className="bottom-area mt-60">
                <span className="btn-border">
                  <Link href="/soccer-bets-2" className="cmn-btn">
                    Browse More
                  </Link>
                </span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Bet;
