import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import Select from "../select/Select";
import Social from "../social/Social";
import signup_1 from "/public/images/icon/signup-counter-icon-1.png";
import signup_2 from "/public/images/icon/signup-counter-icon-2.png";

const countries = [
  { id: 1, name: "United States" },
  { id: 2, name: "United Kingdom" },
  { id: 3, name: "Canada" },
];

const SignUp = ({ active, setActive }) => {
  return (
    <div
      className={`tab-pane fade ${active === "signup" && "show active"}`}
      id="regArea"
      role="tabpanel"
      aria-labelledby="regArea-tab"
    >
      <div className="login-reg-content regMode">
        <div className="modal-body">
          <div className="head-area">
            <h6 className="title">Register On StakeWise</h6>
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
          <div className="form-area">
            <form action="#">
              <div className="row">
                <div className="col-12">
                  <div className="single-input">
                    <label htmlFor="regemail">Email</label>
                    <input
                      type={"email"}
                      id="regemail"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="single-input">
                    <label htmlFor="regpassword">Password</label>
                    <input
                      type={"password"}
                      id="regpassword"
                      placeholder="Email Password"
                    />
                  </div>
                  <div className="single-input">
                    <label>Country</label>
                    {/* TODO: select */}
                    <Select data={countries} />
                  </div>
                </div>
                <div className="col-12">
                  <div className="remember-me">
                    <Link href="/referral-code">Have a referral code?</Link>
                  </div>
                </div>
                <span className="btn-border w-100">
                  <button className="cmn-btn w-100">SIGN UP</button>
                </span>
              </div>
            </form>
            <div className="bottom-area text-center">
              <p>
                Already have an member ?{" "}
                <Link
                  href="/login"
                  className="log-btn"
                  onClick={() => setActive("login")}
                >
                  Login
                </Link>
              </p>
            </div>
            <div className="counter-area">
              <div className="single">
                <div className="icon-area">
                  <Image src={signup_1} alt="icon" />
                </div>
                <div className="text-area">
                  <p>25,179k</p>
                  <p className="mdr">Bets</p>
                </div>
              </div>
              <div className="single">
                <div className="icon-area">
                  <Image src={signup_2} alt="icon" />
                </div>
                <div className="text-area">
                  <p>6.65 BTC</p>
                  <p className="mdr">Total Won</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
