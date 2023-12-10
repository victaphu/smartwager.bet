import Image from "next/image";
import sol_btc from "/public/images/icon/sol-btc.png";

const BettingDetailsTable = () => {
  return (
    <table className="table">
      <tbody>
        <tr>
          <th scope="row">
            <span className="xlr">Market Name</span>
          </th>
          <td>
            <Image src={sol_btc} alt="icon" />
            <span className="xlr">SOL-BTC</span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span className="xlr">Bet Total Amount</span>
          </th>
          <td>
            <span className="xlr">0.05 BTC</span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span className="xlr">Counter Bet Remain</span>
          </th>
          <td>
            <span className="xlr">0.00 BTC</span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span className="xlr">
              Close date - (last date where users can join the bet)
            </span>
          </th>
          <td>
            <span className="xlr">Local Time: 26 Nov 2022 19:38:00</span>
            <span className="xlr">UTC Time: 26 Nov 2022 13:38:00</span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span className="xlr">Expiration date - (determine who won)</span>
          </th>
          <td>
            <span className="xlr">Local Time: 26 Nov 2022 19:38:00</span>
            <span className="xlr">UTC Time: 26 Nov 2022 13:38:00</span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span className="xlr">Escrow Fee From The Winner</span>
          </th>
          <td>
            <span className="xlr">5%</span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BettingDetailsTable;
