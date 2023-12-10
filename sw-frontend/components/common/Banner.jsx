import Image from "next/image";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import affiliate_banner from "/public/images/affiliate-banner.png";
import sell_hero_illus from "/public/images/sell-hero-illus.png";

const Banner = () => {
  return (
    <section className="banner-section inner-banner affiliate">
      <div className="overlay">
        <div className="shape-area">
          <Image
            src={affiliate_banner}
            className="affiliate-illu"
            alt="image"
          />
        </div>
        <div className="banner-content">
          <div className="container">
            <div className="content-shape">
              <Image src={sell_hero_illus} className="obj-8" alt="image" />
            </div>
            <div className="row">
              <div className="col-lg-9 col-md-10">
                <div className="main-content">
                  <h1>Affiliate</h1>

                  {/* Breadcrumb */}
                  <Breadcrumb
                    breadcrumbs={[
                      ["Home", "/"],
                      ["Affiliate", "/affiliate"],
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
