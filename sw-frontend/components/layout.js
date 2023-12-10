import { useState } from "react";
import Footer from "./footer/Footer";
import BetpopUpModal from "./modals/BetpopUpModal";
import NavBar from "./navBar/NavBar";
import Preloader from "./preloader/Preloader";
import ScrollToTop from "./scrollToTop/ScrollToTop";

const Layout = ({ children }) => {
  const [active, setActive] = useState();

  return (
    <>
      {/* Pre Loader */}
      <Preloader />

      {/* Betpop Up Modal */}
      <BetpopUpModal />

      <NavBar />
      {children}
      <Footer />

      {/* Scroll To Top */}
      <ScrollToTop />
    </>
  );
};

export default Layout;
