import Image from "next/image";
import Select from "../select/Select";
import dashboard_coin_icon_1 from "/public/images/icon/dashboard-coin-icon-1.png";
import dashboard_coin_icon_2 from "/public/images/icon/dashboard-coin-icon-2.png";
import dashboard_coin_icon_3 from "/public/images/icon/dashboard-coin-icon-3.png";

const date = [
  { id: 1, name: "2021/01" },
  { id: 2, name: "2021/02" },
  { id: 3, name: "2021/03" },
  { id: 4, name: "2021/04" },
];

const currency = [
  { id: 1, name: "Currency 1" },
  { id: 2, name: "Currency 2" },
  { id: 3, name: "Currency 3" },
  { id: 4, name: "Currency 4" },
];

const type = [
  { id: 1, name: "Type 1" },
  { id: 2, name: "Type 2" },
  { id: 3, name: "Type 3" },
  { id: 4, name: "Type 4" },
];

const TransactionsTab = () => {
  return (
    <div
      className="tab-pane fade"
      id="transactions"
      role="tabpanel"
      aria-labelledby="transactions-tab"
    >
      <div className="transactions-tab">
        <div className="head-area">
          <form action="#">
            <div className="single-input">
              <label>Month</label>
              <Select data={date} />
            </div>
            <div className="single-input">
              <label>Type</label>
              <Select data={type} />
            </div>
            <div className="single-input">
              <label>Currency</label>
              <Select data={currency} />
            </div>
            <div className="text-end">
              <button>Filter</button>
            </div>
          </form>
        </div>
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
      </div>
    </div>
  );
};

export default TransactionsTab;
