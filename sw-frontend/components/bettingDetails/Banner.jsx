import Breadcrumb from "../breadcrumb/Breadcrumb";
import BannerWithAnimation from "../common/BannerWithAnimation";
import betting_details_illus from "/public/images/betting-details-illus.png";

const Banner = () => {
  return (
    <BannerWithAnimation
      titile="Betting Details"
      img={betting_details_illus}
      clss="bet-details"
    >
      <Breadcrumb
        breadcrumbs={[
          ["Home", "/"],
          ["Betting Details", "/"],
        ]}
      />
    </BannerWithAnimation>
  );
};

export default Banner;
