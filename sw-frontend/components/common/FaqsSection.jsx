import Faqs from "./Faqs";

const FaqsSection = () => {
  return (
    <section className="faqs-section faqs-page">
      <div className="overlay pt-120">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-7">
              <div className="section-header text-center">
                <h5 className="sub-title">Frequently Asked Questions</h5>
                <h2 className="title">If you have questions we have answer</h2>
                <p>
                  Answers for our most popular questions about sportsbetting,
                  crypto, and StakeWise
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <ul className="nav" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="cmn-btn active"
                  id="general-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#general"
                  type="button"
                  role="tab"
                  // aria-controls="general"
                  aria-selected="true"
                >
                  general
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="cmn-btn"
                  id="affiliate-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#affiliate"
                  type="button"
                  role="tab"
                  // aria-controls="affiliate"
                  aria-selected="false"
                >
                  affiliate
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="cmn-btn"
                  id="sports-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#sports"
                  type="button"
                  role="tab"
                  // aria-controls="sports"
                  aria-selected="false"
                >
                  sports
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="cmn-btn"
                  id="tournament-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#tournament"
                  type="button"
                  role="tab"
                  // aria-controls="tournament"
                  aria-selected="false"
                >
                  tournament
                </button>
              </li>
            </ul>
          </div>
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="general"
              role="tabpanel"
              aria-labelledby="general-tab"
            >
              <div className="row d-flex justify-content-center">
                <div className="col-xl-10">
                  <div className="faq-box">
                    {/* Faqs */}
                    <Faqs id="accordionFaqsGeneral" />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="affiliate"
              role="tabpanel"
              aria-labelledby="affiliate-tab"
            >
              <div className="row d-flex justify-content-center">
                <div className="col-xl-10">
                  <div className="faq-box">
                    {/* Faqs */}
                    <Faqs id="accordionFaqsAffiliate" />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="sports"
              role="tabpanel"
              aria-labelledby="sports-tab"
            >
              <div className="row d-flex justify-content-center">
                <div className="col-xl-10">
                  <div className="faq-box">
                    {/* Faqs */}
                    <Faqs id="accordionFaqsSports" />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="tournament"
              role="tabpanel"
              aria-labelledby="tournament-tab"
            >
              <div className="row d-flex justify-content-center">
                <div className="col-xl-10">
                  <div className="faq-box">
                    {/* Faqs */}
                    <Faqs id="accordionFaqsTournament" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqsSection;
