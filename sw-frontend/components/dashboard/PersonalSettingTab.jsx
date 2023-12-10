import Select from "../select/Select";

const idType = [
  { id: 1, name: "Passport" },
  { id: 2, name: "Nation ID Card" },
  { id: 3, name: "Driving License" },
];

const PersonalSettingTab = ({ active }) => {
  return (
    <div
      className={`tab-pane fade ${active}`}
      id="setting"
      role="tabpanel"
      aria-labelledby="setting-tab"
    >
      <div className="setting-tab">
        <div className="setting-personal-details">
          <h5>KYC Personal Details</h5>
          <form action="#">
            <div className="row">
              <div className="col-lg-6">
                <div className="single-input">
                  <label htmlFor="perFname">First Name</label>
                  <input
                    type="text"
                    id="perFname"
                    placeholder="Enter First Name"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input">
                  <label htmlFor="perLname">Last Name</label>
                  <input
                    type="text"
                    id="perLname"
                    placeholder="Enter Last Name"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input">
                  <label htmlFor="birth">Date Of Birth</label>
                  <input
                    type="text"
                    id="birth"
                    placeholder="Enter Date Of Birth"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    placeholder="Enter Phone Number"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="single-input">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Enter Address"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input">
                  <label htmlFor="postalcode">Postal Code</label>
                  <input
                    type="text"
                    id="postalcode"
                    placeholder="Enter Postal Code"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    placeholder="Enter Country"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    placeholder="Enter City"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    placeholder="Enter State"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-input">
                  <label>Select ID Type</label>
                  <Select data={idType} />
                </div>
              </div>
              <div className="col-lg-6 d-flex align-items-end">
                <div className="single-input">
                  <div className="file-upload">
                    <div className="right-area">
                      <label className="file">
                        <input type="file" />
                        <span className="file-custom"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <span className="btn-border">
                  <button className="cmn-btn">Begin Verification</button>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettingTab;
