import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Social from "../social/Social";
import arrow_right_2 from "/public/images/icon/arrow-right-2.png";
import logo from "/public/images/logo.png";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container pt-120">
        <div className="footer-bottom-area pt-120">
          <div className="row">
            <div className="col-xl-12">
              <div className="menu-item">
                <Link href="/" className="logo">
                  <Image src={logo} alt="logo" />
                </Link>
              </div>
            </div>
            <div className="col-12">
              <div className="copyright">
                <div className="copy-area">
                  <p>
                    {" "}
                    Copyright © <Link href="/">StakeWise</Link> | Designed by Steve and Victa for <a href="https://constellation-hackathon.devpost.com/" target="_blank">Chainlink Constellation Hackathon (2023)</a>
                    
                  </p>
                </div>
                <ul className="social-link d-flex align-items-center">
                  {/* social start */}
                  <Social
                    items={[
                      [FaGithub, "/"],
                      [FaYoutube, "/"],
                      [FaLinkedinIn, "/"],
                    ]}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
