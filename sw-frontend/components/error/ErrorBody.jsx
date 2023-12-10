import Image from "next/image";
import Link from "next/link";
import error_illus from "/public/images/error-illus.png";

const ErrorBody = () => {
  return (
    <section className="error-section pt-120 pb-120">
      <div className="overlay pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6">
              <div className="img-area">
                <Image src={error_illus} alt="image" />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="section-text">
                <h2 className="title">Page not found</h2>
                <p>Oops.. Looks like you got lost :(</p>
              </div>
              <div className="btn-border">
                <Link href="/" className="cmn-btn">
                  Go Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorBody;
