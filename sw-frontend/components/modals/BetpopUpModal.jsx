import Image from "next/image";
import { useEffect, useState } from "react";
import Select from "../select/Select";
import down_arrow from "/public/images/icon/down-arrow.png";
import up_arrow from "/public/images/icon/up-arrow.png";
import { format } from "date-fns";


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
let idx = 0;
const _games = [
  {
    "gameId": 123,
    "player1": true,
    "player2": false,
    "p1": img1
  },
  {
    "gameId": 2423,
    "player1": true,
    "player2": false,
    "p1": img2,
  },
  {
    "gameId": 342,
    "player1": true,
    "player2": true,
    "p1": img3,
    "p2": img4,
  },
  {
    "gameId": 443,
    "player1": false,
    "player2": true,
    "p2": img5
  },
]

const BetpopUpModal = () => {
  const [odd, setOdd] = useState(1.5);
  const [betValue, setBetValue] = useState(0.1);
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [gameId, setGameId] = useState("");
  const [eventDate, setEventDate] = useState(0);

  const [games, setGames] = useState(_games);

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
    const handler = (e) => {
      console.log(e.relatedTarget.dataset);
      setHome(e.relatedTarget.dataset.home);
      setAway(e.relatedTarget.dataset.away);
      setGameId(e.relatedTarget.dataset.id);
      setEventDate(+e.relatedTarget.dataset.eventdate);
    };
    document.getElementById('betpop-up').addEventListener('show.bs.modal', handler);

    return () => {
      document.getElementById('betpop-up').removeEventListener('show.bs.modal', handler);
    }
  }, [])

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
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="top-item">
                      <button className="cmn-btn firstTeam">
                        {home} will win
                      </button>
                      <button className="cmn-btn greenbutton" onClick={() => {

                        const game = {
                          "gameId": 29042 + games.length,
                          "player1": false,
                          "player2": false
                        };

                        setGames([game, ...games]);
                      }}>
                        Create Wager!
                      </button>
                      <button className="cmn-btn lastTeam">
                        {away} will win
                      </button>
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "maxHeight": "500px", "overflowY": "scroll" }}>
                      {games.map((game, i) => {
                        return (<div style={{ "padding": "20px", "backgroundColor": i % 2 ? "blue" : "navy" }} key={i}>
                          <h4>Game {game.gameId}</h4>
                          <div className="main-content" style={{ "display": "flex" }}>
                            <div className="team-single" style={{ "flexGrow": "1" }}>
                              <span className="mdr">Home</span>
                              <div className="img-area" style={{ "width": "200px" }}>
                                <img onClick={() => !game.player1 && updateGame(game.gameId, true)} src={game.player1 ? game.p1 : "https://s3.eu-central-1.amazonaws.com/join.marketing/uploads/2018/07/Nieuw-logo-blauw.png"} alt="image" />
                              </div>
                            </div>
                            <div className="team-single" style={{ "flexGrow": "1" }}>
                              <span className="mdr">Away</span>
                              <div className="img-area" style={{ "width": "200px" }}>
                                <img onClick={() => !game.player2 && updateGame(game.gameId, false)} src={game.player2 ? game.p2 : "https://s3.eu-central-1.amazonaws.com/join.marketing/uploads/2018/07/Nieuw-logo-blauw.png"} alt="image" />
                              </div>
                            </div>
                          </div>
                        </div>)
                      })}
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
