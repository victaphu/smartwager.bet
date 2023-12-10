import testimonialData from "@/data/testimonialData";
import Slider from "react-slick";
import TestimonialCard from "../cards/TestimonialCard";

// slick css
import "slick-carousel/slick/slick.css";

const Next = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="slick-prev pull-left slick-arrow"
    ></button>
  );
};

const Prev = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="slick-next pull-right slick-arrow"
    ></button>
  );
};

const TestimonialSlider = () => {
  const settings = {
    infinite: true,
    autoplay: false,
    centerMode: true,
    centerPadding: "0px",
    focusOnSelect: false,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <Next />,
    nextArrow: <Prev />,
    dots: false,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 676,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };
  return (
    <Slider {...settings} className="testimonails-carousel">
      {testimonialData.map((singleData) => (
        <TestimonialCard key={singleData.id} data={singleData} />
      ))}
    </Slider>
  );
};

export default TestimonialSlider;
