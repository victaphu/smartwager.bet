import Image from "next/image";
import { useEffect, useState } from "react";
import Select from "../select/Select";
import down_arrow from "/public/images/icon/down-arrow.png";
import up_arrow from "/public/images/icon/up-arrow.png";
import { format } from "date-fns";


const img1 = "https://i.seadn.io/gcs/files/2c41369cdfb2323fe991443e0df7b930.png?auto=format&dpr=1&w=1000";
const img2 = "https://i.seadn.io/gae/qw71kH-wuhbe9rz8r7zOEbDawJG8X28-MRqv5NIMjMZEq8js3ED6URNlq0hdF1WkUifWM-ohusyU279CgDJD-A7954btXfgHl4wNQA?auto=format&dpr=1&w=384"

const _games = [
  {
    "gameId": 123,
    "player1": true,
    "player2": false
  },
  {
    "gameId": 2423,
    "player1": true,
    "player2": false
  },
  {
    "gameId": 342,
    "player1": true,
    "player2": true
  },
  {
    "gameId": 443,
    "player1": false,
    "player2": true
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

  const updateGame = (gameId) => {
    games.find(e=>e.gameId === gameId).player1 = true
    games.find(e=>e.gameId === gameId).player2 = true
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
                      <button className="cmn-btn greenbutton">
                        Create Wager!
                      </button>
                      <button className="cmn-btn lastTeam">
                        {away} will win
                      </button>
                    </div>
                    <div style={{"display": "flex", "flexDirection": "column", "maxHeight": "500px", "overflowY": "scroll"}}>
                    {games.map((game, i) => {
                      return (<div style={{"padding": "20px", "backgroundColor" : i%2 ? "blue": "navy"}} key={i}>
                        <h4>Game {game.gameId}</h4>
                        <div className="main-content" style={{ "display": "flex" }}>
                          <div className="team-single" style={{"flexGrow": "1"}}>
                            <span className="mdr">Home</span>
                            <div className="img-area">
                              <img onClick={() => !game.player1 && updateGame(game.gameId)} src={game.player1 ? img1 : "https://s3.eu-central-1.amazonaws.com/join.marketing/uploads/2018/07/Nieuw-logo-blauw.png"} alt="image" style={{"width": "200px"}}/>
                            </div>
                          </div>
                          <div className="team-single" style={{"flexGrow": "1"}}>
                            <span className="mdr">Away</span>
                            <div className="img-area" style={{"width": "200px"}}>
                              <img onClick={() => !game.player2 && updateGame(game.gameId)} src={game.player2 ? img2 : "https://s3.eu-central-1.amazonaws.com/join.marketing/uploads/2018/07/Nieuw-logo-blauw.png"} alt="image" />
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
