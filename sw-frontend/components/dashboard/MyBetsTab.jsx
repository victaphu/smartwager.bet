import gameData from "@/data/ganeData";
import GameCard from "../cards/GameCard";

const MyBetsTab = () => {
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
              {/* <GameCard itm={gameData[0]} /> */}
            </div>
            <div
              className="tab-pane fade"
              id="canceled"
              role="tabpanel"
              aria-labelledby="canceled-tab"
            >
              {/* <GameCard itm={gameData[0]} /> */}
            </div>
            <div
              className="tab-pane fade"
              id="finished"
              role="tabpanel"
              aria-labelledby="finished-tab"
            >
              {/* <GameCard itm={gameData[0]} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBetsTab;
