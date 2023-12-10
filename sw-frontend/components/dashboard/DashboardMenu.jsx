import Image from "next/image";
import { useState } from "react";

import Select from "../select/Select";
import dashboard_profile_1 from "/public/images/dashboard-profile-1.png";
import cancel_btn from "/public/images/icon/cancel-btn.png";
import notifications from "/public/images/icon/notifications.png";

import latest_tips_1 from "/public/images/latest-tips-1.png";
import latest_tips_2 from "/public/images/latest-tips-2.png";
import latest_tips_3 from "/public/images/latest-tips-3.png";

import Link from "next/link";
import dashboard_profile_2 from "/public/images/dashboard-profile-2.png";
import calendar_icon_2 from "/public/images/icon/calendar-icon-2.png";
import dashboard_icon from "/public/images/icon/dashboard-icon.png";
import history_icon from "/public/images/icon/history-icon.png";
import memberships_icon from "/public/images/icon/memberships-icon.png";
import settings_icon from "/public/images/icon/settings-icon.png";
import subscriptions_icon from "/public/images/icon/subscriptions-icon.png";

const DashboardMenu = () => {
  const [userContent, setUserContent] = useState(false);

  const userContentHandler = () => {
    setUserContent(!userContent);
  };

  return (
    <div className="right-area header-action d-flex align-items-center max-un">
      <div className="single-item user-area">
        <div
          className="user-btn d-flex align-items-center"
          onClick={userContentHandler}
        >
          <w3m-button
            label="Connect Wallet"
          />
          <i className="icon-c-down-arrow"></i>
        </div>
        <div className={`main-area user-content ${userContent && "active"} `}>
          <div className="head-area d-flex">
            <div className="text-area">
              <w3m-account-button/>
            </div>
          </div>
          <ul>
            <li className="border-area">
              <Link href="#" className="active">
                <Image src={dashboard_icon} alt="icon" />
                <p className="mdr">Dashboard</p>
              </Link>
            </li>
            <li>
              <Link href="#">
                <w3m-network-button/>
              </Link>
            </li>
            <li className="border-area">
              <Link href="#">
                <Image src={history_icon} alt="icon" />
                <p className="mdr">Transaction History</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardMenu;
