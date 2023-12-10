import { StakeWiseContext } from "@/context/context";
import { useContext } from "react";
import DashboardTab from "./DashboardTab";
import DepositTab from "./DepositTab";
import MyBetsTab from "./MyBetsTab";
import TransactionsTab from "./TransactionsTab";
import WithdrawTab from "./WithdrawTab";

const RightSide = () => {
  const { url } = useContext(StakeWiseContext);

  return (
    <div className="col-xl-9 col-lg-8">
      <div className="tab-content">
        {/* Dashboard Tab */}
        <DashboardTab active={url === "/dashboard" && "show active"} />

        {/* My Bets Tab */}
        <MyBetsTab />

        {/* Deposit Tab */}
        <DepositTab />

        {/* Withdraw Tab */}
        <WithdrawTab />


        {/* Transactions Tab */}
        <TransactionsTab />
      </div>
    </div>
  );
};

export default RightSide;
