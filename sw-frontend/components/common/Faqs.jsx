import faqData from "../../data/faqData";

const Faqs = ({ id = "accordionFaqs" }) => {
  return (
    <div className="accordion" id={id}>
      {faqData.map((singleFaq) => (
        <div key={singleFaq.id} className="accordion-item">
          <h5 className="accordion-header" id={`heading-${id}-${singleFaq.id}`}>
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${id}-${singleFaq.id}`}
              aria-expanded="false"
            >
              {singleFaq.title}
            </button>
          </h5>
          <div
            id={`collapse-${id}-${singleFaq.id}`}
            className="accordion-collapse collapse"
            aria-labelledby={`heading-${id}-${singleFaq.id}`}
            data-bs-parent={`#${id}`}
          >
            <div className="accordion-body">
              <p>{singleFaq.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faqs;
