import Image from "next/image";
import Select from "../select/Select";
import DataPicker from "./DataPicker";
import date_icon from "/public/images/icon/date-icon.png";
import search_icon from "/public/images/icon/search-icon.png";

const teams = [
  { id: 1, name: "Search by team name" },
  { id: 2, name: "Team 1" },
  { id: 3, name: "Team 2" },
  { id: 4, name: "Team 3" },
];

const leagues = [
  { id: 1, name: "Select League" },
  { id: 2, name: "League 1" },
  { id: 3, name: "League 2" },
  { id: 4, name: "League 3" },
];

const Filter = () => {
  return (
    <div className="filter-section mb-60">
      <div className="section-text text-center">
        <h3>All Soccer Bets</h3>
      </div>
      <form action="#">
        <div className="row">
          <div className="col-xl-3 col-lg-6">
            <div className="input-area">
              <Image src={search_icon} alt="icon" />
              <input type="text" placeholder="Search by League name" />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6">
            <div className="single-input">
              <Select data={teams} />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6">
            <div className="single-input">
              <Select data={leagues} />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6">
            <div className="input-area">
              <Image src={date_icon} alt="icon" />

              {/* Data Picker */}
              <DataPicker placeholder="Select Date" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Filter;
