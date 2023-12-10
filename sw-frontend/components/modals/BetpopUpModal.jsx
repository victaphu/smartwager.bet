import Image from "next/image";
import { useEffect, useState } from "react";
import Select from "../select/Select";
import down_arrow from "/public/images/icon/down-arrow.png";
import up_arrow from "/public/images/icon/up-arrow.png";
import { format } from "date-fns";

const BetpopUpModal = () => {
  const [odd, setOdd] = useState(1.5);
  const [betValue, setBetValue] = useState(0.1);
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [gameId, setGameId] = useState("");
  const [eventDate, setEventDate] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      console.log(e.relatedTarget.dataset); 
      setHome(e.relatedTarget.dataset.home);
      setAway(e.relatedTarget.dataset.away);
      setGameId(e.relatedTarget.dataset.id);
      setEventDate(e.relatedTarget.dataset.eventdate);
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
                    <div className="select-odds d-flex align-items-center">
                      <h6>Select Odds</h6>
                      <div className="d-flex in-dec-val">
                        <input
                          type="text"
                          value={odd}
                          className="InDeVal2"
                          onChange={(e) => setOdd(e.target.value)}
                        />
                        <div className="btn-area">
                          <button className="plus2">
                            <Image src={up_arrow} alt="icon" />
                          </button>
                          <button className="minus2">
                            <Image src={down_arrow} alt="icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mid-area">
                      <div className="single-area">
                        <div className="d-flex in-dec-val">
                          <input
                            type="text"
                            value={betValue}
                            className="InDeVal1"
                            onChange={(e) => setBetValue(e.target.value)}
                          />
                          <div className="btn-area">
                            <button className="plus">
                              <Image src={up_arrow} alt="icon" />
                            </button>
                            <button className="minus">
                              <Image src={down_arrow} alt="icon" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="single-area quick-amounts">
                        <div className="item-title d-flex align-items-center">
                          <p>Quick Amounts</p>
                        </div>
                        <div className="input-item">
                          <button className="quickIn">0.005</button>
                          <button className="quickIn">0.025</button>
                          <button className="quickIn">0.1</button>
                          <button className="quickIn">0.5</button>
                          <button className="quickIn">2.5</button>
                        </div>
                      </div>
                      <div className="single-area smart-value">
                        <div className="item-title d-flex align-items-center">
                          <p className="mdr">Smart Contact Value</p>
                        </div>
                        <div className="contact-val d-flex align-items-center">
                          <h4>0.1103</h4>
                          <h5>ETH</h5>
                        </div>
                      </div>
                    </div>
                    <div className="bottom-area">
                      <div className="fee-area">
                        <p>
                          Winner will get: <span className="amount">0.179</span>{" "}
                          ETH
                        </p>
                        <p className="fee">
                          Escrow Fee: <span>5%</span>
                        </p>
                      </div>
                      <div className="btn-area">
                        <button>Make (0.1 ETH) Bet</button>
                      </div>
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
