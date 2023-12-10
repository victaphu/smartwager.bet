import Slider from "react-slick";

// slick css
import "slick-carousel/slick/slick.css";
import LatestPostCard from "../cards/LatestPostCard";

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

const LatestPostSlider = () => {
  const settings = {
    infinite: true,
    autoplay: false,
    centerMode: false,
    focusOnSelect: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <Next />,
    nextArrow: <Prev />,
    dots: false,
    dotsClass: "section-dots",
  };
  return (
    <Slider {...settings} className="sidebar-carousel">
      {[...Array(3)].map((_, i) => (
        <LatestPostCard key={i} />
      ))}
    </Slider>
  );
};

export default LatestPostSlider;
