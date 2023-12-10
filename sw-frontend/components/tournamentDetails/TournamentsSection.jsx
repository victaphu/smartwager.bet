import tournamentData from "@/data/tournamentData";
import TournamentCard from "../cards/TournamentCard";
import Pagination from "../common/Pagination";
import TournamentTable from "./TournamentTable";

const TournamentsSection = () => {
  return (
    <section className="how-works-tournaments tournaments-section">
      <div className="overlay">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Tournament Card */}
              <TournamentCard data={tournamentData[1]} />
            </div>
          </div>
          <div className="row cus-mar">
            <div className="col-lg-12">
              <div className="table-responsive mt-60">
                {/* Tournament Table */}
                <TournamentTable />
              </div>
              <div className="row mt-60">
                <div className="col-lg-12 d-flex justify-content-center">
                  {/* Pagination */}
                  <Pagination />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentsSection;
