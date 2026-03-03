<div class="mt-4 pt-2 mt-sm-0 pt-sm-0 col-md-6 col-lg-5">
  <div class="shadow rounded border-0 ml-lg-4 card">
    <div class="card-body">
      <h5 class="card-title text-center">Get 30 days FREE Trial</h5>
      <form className="login-form mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label className="">
                First name <span className="text-danger">*</span>
              </label>
              <div className="position-relative">
                <i>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="feather feather-user fea icon-sm icons"
                  >
                    <g>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                </i>
                <input
                  type="text"
                  className="form-control pl-5"
                  placeholder="First Name"
                  name="s"
                  autocomplete="off"
                />
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
              <label class="">
                Your Email <span class="text-danger">*</span>
              </label>
              <div class="position-relative">
                <i>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="feather feather-mail fea icon-sm icons"
                  >
                    <g>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </g>
                  </svg>
                </i>
                <input
                  type="email"
                  class="form-control pl-5"
                  placeholder="Email"
                  name="email"
                />
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
              <label class="">
                Password <span class="text-danger">*</span>
              </label>
              <div class="position-relative">
                <i>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-lock fea icon-sm icons"
                  >
                    <g>
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </g>
                  </svg>
                </i>
                <input
                  type="password"
                  class="form-control pl-5"
                  placeholder="Password"
                  autocomplete="off"
                />
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
              <label class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customCheck1"
                />
                <label class="custom-control-label" for="customCheck1">
                  I Accept{" "}
                  <a class="text-primary" href="/index-landing-four">
                    Terms And Condition
                  </a>
                </label>
              </label>
            </div>
          </div>
          <div class="col-md-12">
            <button class="btn btn-block btn-primary">Register</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>;
