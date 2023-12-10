import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import Social from "../social/Social";

const FollowUs = () => {
  return (
    <div className="sidebar-single">
      <h5 className="title">Follow Us</h5>
      <form action="#">
        <div className="form-group">
          <ul className="social-link d-flex align-items-center">
            {/* social start */}
            <Social
              items={[
                [FaFacebookF, "/"],
                [FaTwitter, "/"],
                [FaLinkedinIn, "/"],
                [FaInstagram, "/"],
              ]}
            />
          </ul>
        </div>
      </form>
    </div>
  );
};

export default FollowUs;
