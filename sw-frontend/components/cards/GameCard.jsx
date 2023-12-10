import Image from "next/image";
import Countdown from "react-countdown";
import CountdownDisplay from "../common/CountdownDisplay";
import { format } from 'date-fns';
format(new Date(), 'yyyy/MM/dd kk:mm:ss')
const GameCard = ({ itm }) => {
  const { home, away, division, home_icon, away_icon } = itm;
  const date = new Date(Number(itm?.eventDate) * 1000);
  return (
    // <div className="col-lg-6">
    <div className="single-area">
      <div className="head-area d-flex align-items-center">
        <span className="mdr cmn-btn">Pick Winner</span>
        <p>{format(date, "PPP ppp")}</p>
      </div>
      <div className="main-content">
        <div className="team-single">
          <h4>{home}</h4>
          <span className="mdr">Home</span>
          <div className="img-area">
            <Image src={home_icon} alt="image" />
          </div>
        </div>
        <div className="mid-area text-center">
          <div className="countdown d-flex align-items-center justify-content-center">
            {/* Countdown Display */}
            <Countdown
              date={date}
              renderer={CountdownDisplay}
            />
          </div>
          {/* <h6>Division- {division}</h6> */}
        </div>
        <div className="team-single">
          <h4>{away}</h4>
          <span className="mdr">Away</span>
          <div className="img-area">
            <Image src={away_icon} alt="image" />
          </div>
        </div>
      </div>
      <div className="bottom-item">
        <button
          type="button"
          className="cmn-btn firstTeam"
          data-bs-toggle="modal"
          data-bs-target="#betpop-up"
          data-home={home}
          data-away={away}
          data-id={Number(itm.eventId)}
          data-eventdate={Number(itm.eventDate) * 1000}
        >
          {home} will win
        </button>
        <button
          type="button"
          className="cmn-btn lastTeam"
          data-bs-toggle="modal"
          data-bs-target="#betpop-up"
          data-home={home}
          data-away={away}
          data-id={Number(itm.eventId)}
          data-eventdate={Number(itm.eventDate) * 1000}
        >
          {away} will win
        </button>
      </div>
    </div>
    // </div>
  );
};

export default GameCard;
