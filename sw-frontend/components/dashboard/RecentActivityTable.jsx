import Image from "next/image";
import dashboard_coin_icon_1 from "/public/images/icon/dashboard-coin-icon-1.png";
import dashboard_coin_icon_2 from "/public/images/icon/dashboard-coin-icon-2.png";
import dashboard_coin_icon_3 from "/public/images/icon/dashboard-coin-icon-3.png";

const RecentActivityTable = () => {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Date/Time</th>
            <th scope="col">Type</th>
            <th scope="col">Currency</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">2021-01-07 16:33:53</th>
            <td>Deposit</td>
            <td>BTC</td>
            <td>
              <Image src={dashboard_coin_icon_1} alt="icon" />
              0.00016556
            </td>
          </tr>
          <tr>
            <th scope="row">2021-01-07 16:33:53</th>
            <td>Withdrawal</td>
            <td>BTC</td>
            <td>
              <Image src={dashboard_coin_icon_1} alt="icon" />
              0.00016556
            </td>
          </tr>
          <tr>
            <th scope="row">2021-01-07 16:33:53</th>
            <td>Refer com.</td>
            <td>USDT</td>
            <td>
              <Image src={dashboard_coin_icon_2} alt="icon" />
              13.1072000
            </td>
          </tr>
          <tr>
            <th scope="row">2021-01-07 16:33:53</th>
            <td>Withdrawal</td>
            <td>BTC</td>
            <td>
              <Image src={dashboard_coin_icon_1} alt="icon" />
              0.00016556
            </td>
          </tr>
          <tr>
            <th scope="row">2021-01-07 16:33:53</th>
            <td>Deposit</td>
            <td>TRX</td>
            <td>
              <Image src={dashboard_coin_icon_3} alt="icon" />
              368.033428
            </td>
          </tr>
          <tr>
            <th scope="row">2021-01-07 16:33:53</th>
            <td>Refer com.</td>
            <td>BTC</td>
            <td>
              <Image src={dashboard_coin_icon_1} alt="icon" />
              0.00016556
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
