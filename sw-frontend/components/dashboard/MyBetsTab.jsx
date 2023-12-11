import { useEffect } from "react";
import useFetchGameNFTs from "../hooks/useFetchGameNFTs";
import { useAccount } from "wagmi";


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


function Card({ game, i }) {
  const homeImage = game.p1Position === BigInt(1) || game.p2Position === BigInt(1) ? getRandomImage() : emptySlot;
  const awayImage = game.p1Position === BigInt(2) || game.p2Position === BigInt(2) ? getRandomImage() : emptySlot;

  const homePlayer = game.p1Position === BigInt(1) ? game.player1 : game.p2Position === BigInt(1) ? game.player2 : undefined;
  const awayPlayer = game.p1Position === BigInt(2) ? game.player1 : game.p2Position === BigInt(2) ? game.player2 : undefined;

  return (<div style={{ "padding": "20px", "backgroundColor": i % 2 ? "blue" : "navy" }} key={i}>
    <h4>Game dNFT {game.id}</h4>
    <div className="main-content top-item">
      <div className="team-single">
        <span className="mdr">Home</span>
        <div className="img-area text-center" style={{ "width": "200px" }}>
          <img src={homeImage} alt="image" />
          {!homePlayer ? <div className="btn btn-primary">Awaiting Wager</div> : <p style={{ fontSize: "12px" }}>{homePlayer}</p>}
        </div>
      </div>
      <div className="team-single">
        <span className="mdr">Away</span>
        <div className="img-area text-center" style={{ "width": "200px" }}>
          <img src={awayImage} alt="image" />
          {!awayPlayer ? <div className="btn btn-primary">Awaiting Wager</div> : <p style={{ fontSize: "12px" }}>{awayPlayer}</p>}
        </div>
      </div>
    </div>
  </div>)
}

const MyBetsTab = () => {
  const { address } = useAccount();
  const { fetchGames, games, isLoading } = useFetchGameNFTs();
  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div
      className="tab-pane fade"
      id="my-bets"
      role="tabpanel"
      aria-labelledby="my-bets-tab"
    >
      <div className="bets-tab">
        <div className="d-flex">
          <ul className="nav" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="cmn-btn active"
                id="open-playing-tab"
                data-bs-toggle="tab"
                data-bs-target="#open-playing"
                type="button"
                role="tab"
                // aria-controls="open-playing"
                aria-selected="true"
              >
                Open Playing
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="cmn-btn"
                id="canceled-tab"
                data-bs-toggle="tab"
                data-bs-target="#canceled"
                type="button"
                role="tab"
                // aria-controls="canceled"
                aria-selected="false"
              >
                Canceled
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="cmn-btn"
                id="finished-tab"
                data-bs-toggle="tab"
                data-bs-target="#finished"
                type="button"
                role="tab"
                // aria-controls="finished"
                aria-selected="false"
              >
                Finished
              </button>
            </li>
          </ul>
        </div>
        <div className="bet-this-game">
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="open-playing"
              role="tabpanel"
              aria-labelledby="open-playing-tab"
            >
              <div className="top-item">
                <div style={{ "display": "flex", "flexDirection": "column", "maxHeight": "500px", "overflowY": "scroll" }}>
                  {games.filter(g => g.started <= 1 && (g.player1 === address || g.player2 === address)).map((game, i) => <Card i={i} game={game} key={i} />)}
                </div>
                <div
                  className="tab-pane fade"
                  id="canceled"
                  role="tabpanel"
                  aria-labelledby="canceled-tab"
                >
                  <div style={{ "display": "flex", "flexDirection": "column", "maxHeight": "500px", "overflowY": "scroll" }}></div>
                  {games.filter(g => g.started === 2 && (g.player1 === address || g.player2 === address)).map((game, i) => <Card i={i} game={game} key={i} />)}
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="finished"
                role="tabpanel"
                aria-labelledby="finished-tab"
              >
                <div style={{ "display": "flex", "flexDirection": "column", "maxHeight": "500px", "overflowY": "scroll" }}>
                  {games.filter(g => g.started > 2 && (g.player1 === address || g.player2 === address)).map((game, i) => <Card i={i} game={game} key={i} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBetsTab;
