import Image from "next/image";
import call_to_action from "/public/images/call-to-action-bg.png";

const CallToAction = () => {
  return (
    <section className="call-to-action">
      <div className="overlay">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-5 order-lg-0 order-1">
              <div className="img-area d-rtl">
                <Image src={call_to_action} alt="image" className="max-un" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-text">
                <h5 className="sub-title">Are You a degen?</h5>
                <h2 className="title">Your 1st Prediction is on us</h2>
                <p>
                  Don&#39;t wait another minute. Take action straight from
                  StakeWise Wallet and benefit from instant trade execution and
                  the best exchange rates out there
                </p>
              </div>
              <span className="btn-border">
                <button
                  type="button"
                  className="cmn-btn reg"
                  data-bs-toggle="modal"
                  data-bs-target="#loginMod"
                >
                  Get Start Now
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
