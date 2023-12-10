import Image from "next/image";
import Link from "next/link";
import dashboard_icon_2 from "/public/images/icon/dashboard-sidebar-icon-2.png";

const HelpCard = () => {
  return (
    <div className="single-item">
      <Image src={dashboard_icon_2} alt="images" />
      <h5>Need Help?</h5>
      <p className="mdr">Have questions? Our experts are here to help!.</p>
      <span className="btn-border">
        <Link href="/contact" className="cmn-btn">
          Get Start Now
        </Link>
      </span>
    </div>
  );
};

export default HelpCard;
