const { default: Image } = require("next/image");
import coin_1 from "/public/images/coin-1.png";
import coin_3 from "/public/images/coin-3.png";
import coin_5 from "/public/images/coin-5.png";
import coin_6 from "/public/images/coin-6.png";
import time_circle from "/public/images/time-circle.png";
import winner_cup from "/public/images/winner-cup.png";

const BannerWithAnimation = ({ children, titile, clss, img }) => {
  return (
    <section
      className={`banner-section inner-banner soccer-bets currency-bet ${clss}`}
    >
      <div className="overlay">
        <div className="shape-area">
          <Image src={winner_cup} className="obj-1" alt="image" />
          <Image src={coin_5} className="obj-2" alt="image" />
          <Image src={coin_3} className="obj-3" alt="image" />
          <Image src={coin_6} className="obj-4" alt="image" />
          <Image src={img} className="chart-illu" alt="image" />
        </div>
        <div className="banner-content">
          <div className="container">
            <div className="content-shape">
              <Image src={coin_1} className="obj-8" alt="image" />
              <Image src={time_circle} className="obj-9" alt="image" />
            </div>
            <div className="row">
              {/* <div className="col-lg-6 col-md-10"> */}
              <div className="col-lg-9 col-md-10">
                <div className="main-content">
                  <h1>{titile}</h1>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerWithAnimation;
