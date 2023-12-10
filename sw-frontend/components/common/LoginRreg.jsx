import Login from "./Login";
import SignUp from "./SignUp";

const LoginRreg = () => {
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
                  <ul className="nav log-reg-btn justify-content-around">
                    <li className="bottom-area" role="presentation">
                      <button
                        className="nav-link"
                        id="regArea-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#regArea"
                        type="button"
                        role="tab"
                        // aria-controls="regArea"
                        aria-selected="false"
                      >
                        SIGN UP
                      </button>
                    </li>
                    <li className="bottom-area" role="presentation">
                      <button
                        className="nav-link active"
                        id="loginArea-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#loginArea"
                        type="button"
                        role="tab"
                        // aria-controls="loginArea"
                        aria-selected="true"
                      >
                        LOGIN
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {/* login here */}
                    <Login />
                    {/* Sign Up here */}
                    <SignUp />
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

export default LoginRreg;
