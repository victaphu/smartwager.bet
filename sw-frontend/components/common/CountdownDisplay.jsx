const CountdownDisplay = ({ days, hours, minutes, seconds }) => {
  return (
    <>
      <h4>
        <span className="hours">{days}</span>
        <span className="ref">d</span>
        <span className="seperator">:</span>
      </h4>
      <h4>
        <span className="hours">{hours}</span>
        <span className="ref">h</span>
        <span className="seperator">:</span>
      </h4>
      <h4>
        <span className="minutes">{minutes}</span>
        <span className="ref">m</span>
      </h4>
    </>
  );
};

export default CountdownDisplay;
