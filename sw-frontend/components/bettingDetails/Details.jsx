import Countdown from "react-countdown";
import CountdownDisplay from "../common/CountdownDisplay";
import BettingDetailsTable from "./BettingDetailsTable";

const Details = () => {
  return (
    <section className="betting-details">
      <div className="overlay pb-120">
        <div className="container">
          <div className="main-content">
            <div className="row cus-mar">
              <div className="col-lg-12">
                <div className="time-area text-center mt-60 mb-60">
                  <div className="countdown d-flex align-items-center justify-content-center">
                    <Countdown
                      date={Date.now() + 10000000}
                      renderer={CountdownDisplay}
                    />
                  </div>
                  <div className="bet-id">
                    <p>Bet Id: #18574b25-dda0-4523-be24-a8df2cf69ca1</p>
                  </div>
                </div>
                <div className="table-responsive">
                  {/* Betting Details Table */}
                  <BettingDetailsTable />
                </div>
                <div className="escrow-bet-single">
                  <div className="left-area">
                    <h5>Sparkles (0.05 BTC)</h5>
                    <p>
                      If SOL-BTC price, will be Above 0.00356930 BTC in the
                      expiratio
                    </p>
                  </div>
                  <div className="right-area">
                    <p>If win, will get: 0.095</p>
                    <button
                      type="button"
                      className="cmn-btn reg"
                      data-bs-toggle="modal"
                      data-bs-target="#loginMod"
                    >
                      Bet Now
                    </button>
                  </div>
                </div>
                <div className="escrow-bet-single">
                  <div className="left-area">
                    <h5>Dark bit (0.02 BTC)</h5>
                    <p>
                      If SOL-BTC price, will be Below 0.00356930 in the
                      expiration date
                    </p>
                  </div>
                  <div className="right-area">
                    <p>If win, will get: 0.095</p>
                    <button
                      type="button"
                      className="cmn-btn login"
                      data-bs-toggle="modal"
                      data-bs-target="#loginMod"
                    >
                      Bet Now
                    </button>
                  </div>
                </div>
                <div className="escrow-bet-single">
                  <div className="left-area">
                    <h5>Master (0.03 BTC)</h5>
                    <p>
                      If SOL-BTC price, will be Below 0.00356930 in the
                      expiration date
                    </p>
                  </div>
                  <div className="right-area">
                    <p>If win, will get: 0.095</p>
                    <button
                      type="button"
                      className="cmn-btn reg"
                      data-bs-toggle="modal"
                      data-bs-target="#loginMod"
                    >
                      Bet Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
