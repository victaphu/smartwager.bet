import Image from "next/image";
import Slider from "react-slick";
import amazing_features_icon_1 from "/public/images/icon/amazing-features-icon-1.png";
import amazing_features_icon_2 from "/public/images/icon/amazing-features-icon-2.png";
import amazing_features_icon_3 from "/public/images/icon/amazing-features-icon-3.png";
import amazing_features_icon_4 from "/public/images/icon/amazing-features-icon-4.png";

const featureData = [
  {
    id: 1,
    title: "Safety",
    img: amazing_features_icon_1,
  },
  {
    id: 2,
    title: "Transparency",
    img: amazing_features_icon_2,
  },
  {
    id: 3,
    title: "Low Commissions",
    img: amazing_features_icon_3,
  },
  {
    id: 4,
    title: "Player is king",
    img: amazing_features_icon_4,
  },
  {
    id: 5,
    title: "Low Commissions",
    img: amazing_features_icon_3,
  },
];

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

const FeatureSlider = () => {
  const settings = {
    infinite: true,
    autoplay: false,
    focusOnSelect: false,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <Next />,
    nextArrow: <Prev />,
    dots: false,
    dotsclassName: "section-dots",
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 460,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings} className="features-carousel">
      {featureData.map((itm) => (
        <div key={itm.id} className="single-slide">
          <div className="slide-content">
            <div className="icon-area">
              <Image src={itm.img} alt="icon" />
            </div>
            <h5>{itm.title}</h5>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default FeatureSlider;
