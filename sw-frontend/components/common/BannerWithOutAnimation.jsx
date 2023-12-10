import Image from "next/image";

const BannerWithOutAnimation = ({ children, titile, clss, img, illus }) => {
  return (
    <section className={`banner-section inner-banner ${clss}`}>
      <div className="overlay">
        <div className="shape-area">
          <Image src={img} className="affiliate end-0 bottom-0" alt="image" />
        </div>
        <div className="banner-content">
          <div className="container">
            {illus !== undefined && (
              <div className="content-shape">
                <Image src={illus} className="obj-8" alt="image" />
              </div>
            )}
            <div className="row">
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

export default BannerWithOutAnimation;
