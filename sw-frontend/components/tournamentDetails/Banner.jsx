import Image from "next/image";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import sell_hero_illus from "/public/images/sell-hero-illus.png";
import tournaments_illus from "/public/images/tournaments-illus.png";

const Banner = () => {
  return (
    <section className="banner-section inner-banner tournaments">
      <div className="overlay">
        <div className="shape-area">
          <Image
            src={tournaments_illus}
            className="tournaments-illu"
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
                  <h1>Tournaments Details</h1>
                  <Breadcrumb
                    breadcrumbs={[
                      ["Home", "/"],
                      ["Tournaments", "/tournament"],
                      ["Tournaments Details", "/"],
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
