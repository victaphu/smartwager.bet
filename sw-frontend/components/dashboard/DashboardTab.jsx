import Image from "next/image";
import RecentActivityTable from "./RecentActivityTable";
import user_info_icon_1 from "/public/images/icon/user-info-icon-1.png";
import user_info_icon_2 from "/public/images/icon/user-info-icon-2.png";
import user_info_icon_3 from "/public/images/icon/user-info-icon-3.png";

const DashboardTab = ({ active }) => {
  return (
    <div
      className={`tab-pane fade ${active}`}
      id="dashboard"
      role="tabpanel"
      aria-labelledby="dashboard-tab"
    >
      <div className="row">
        <div className="col-xl-4 col-lg-6">
          <div className="single-info">
            <Image src={user_info_icon_1} alt="icon" />
            <div className="text-area">
              <h4>678</h4>
              <p className="mdr">Total Match</p>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-6">
          <div className="single-info">
            <Image src={user_info_icon_2} alt="icon" />
            <div className="text-area">
              <h4>91%</h4>
              <p className="mdr">Win Ratio</p>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-6">
          <div className="single-info">
            <Image src={user_info_icon_3} alt="icon" />
            <div className="text-area">
              <h4>22</h4>
              <p className="mdr">Achievements</p>
            </div>
          </div>
        </div>
        <div className="col-12">
          <h5 className="title">Recent Activity</h5>
          {/* Recent Activity Table */}
          <RecentActivityTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
