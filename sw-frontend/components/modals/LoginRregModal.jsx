import { StakeWiseContext } from "@/context/context";
import { useContext } from "react";
import Login from "../common/Login";
import SignUp from "../common/SignUp";

const LoginRregModal = () => {
  const { setActive, active } = useContext(StakeWiseContext);

  return (
    <div className="log-reg">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="modal fade" id="loginMod">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header justify-content-center">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  {/* <ul className="nav log-reg-btn justify-content-around">
                    <li className="bottom-area" role="presentation">
                      <button
                        className={`nav-link ${
                          active === "signup" && "active"
                        }`}
                        id="regArea-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#regArea"
                        type="button"
                        role="tab"
                        // aria-controls="regArea"
                      >
                        SIGN UP
                      </button>
                    </li>
                    <li className="bottom-area" role="presentation">
                      <button
                        className={`nav-link ${active === "login" && "active"}`}
                        id="loginArea-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#loginArea"
                        type="button"
                        role="tab"
                        // aria-controls="loginArea"
                      >
                        LOGIN
                      </button>
                    </li>
                  </ul> */}
                  <div className="tab-content">
                    {/* login here */}
                    {/* <Login active={active} /> */}
                    {/* Sign Up here */}
                    <SignUp active={active} setActive={setActive} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRregModal;
