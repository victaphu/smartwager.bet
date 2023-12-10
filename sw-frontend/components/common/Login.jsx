import Link from "next/link";
import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import Social from "../social/Social";

const Login = ({ active }) => {
  const [checked, setChecked] = useState(true);
  return (
    <div
      className={`tab-pane fade ${active === "login" && "show active"}`}
      id="loginArea"
      role="tabpanel"
      aria-labelledby="loginArea-tab"
    >
      <div className="login-reg-content">
        <div className="modal-body">
          <div className="head-area">
            <h6 className="title">Login Direetly With</h6>
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
                    <label htmlFor="logemail">Email</label>
                    <input
                      type="text"
                      id="logemail"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="single-input">
                    <label htmlFor="logpassword">Password</label>
                    <input
                      type="text"
                      id="logpassword"
                      placeholder="Email Password"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="remember-me">
                    <label className="checkbox-single d-flex align-items-center">
                      <span className="left-area">
                        <span className="checkbox-area d-flex">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setChecked(!checked)}
                          />
                          <span className="checkmark"></span>
                        </span>
                        <span className="item-title d-flex align-items-center">
                          <span>Remember Me</span>
                        </span>
                      </span>
                    </label>
                    <Link href="/forgot-password">Forgot Password</Link>
                  </div>
                </div>
                <span className="btn-border w-100">
                  <button className="cmn-btn w-100">LOGIN</button>
                </span>
              </div>
            </form>
            <div className="bottom-area text-center">
              <p>
                Not a member ?{" "}
                <Link href="/register" className="reg-btn">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
