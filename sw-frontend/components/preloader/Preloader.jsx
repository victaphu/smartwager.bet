import { useEffect, useState } from "react";

const Preloader = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [isLoded, setIsLoded] = useState(null);

  useEffect(() => {
    window.addEventListener("load", () => {
      setIsLoded("loaded");
    });

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showLoader && (
        <div className={`preloader ${isLoded}`} id="preloader"></div>
      )}
    </>
  );
};

export default Preloader;
