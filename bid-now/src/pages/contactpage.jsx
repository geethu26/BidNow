import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const ContactPage = () => {
  return (
    <>
      <Navbar />

      <div className="container contact-container my-5 bg-white rounded shadow">
        <div className="row">
          {/* Contact Form */}
          <div className="col-md-7 p-4 contact-form">
            <h2 className="text-primary mb-4">CONTACT US</h2>
            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Your Name"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Email Id:</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Email Id"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Mobile No.:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Mobile Number"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>State:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter State"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label>Interested Material:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Interested Material"
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2 rounded-pill"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div
            className="col-md-5 p-4 text-white"
            style={{ backgroundColor: "#0a285f" }}
          >
            <h5 className="mb-4">Hi! We are always here to help you.</h5>
            <div className="mb-3 bg-primary bg-opacity-75 p-3 rounded">
              <i className="bi bi-telephone-fill me-2"></i>
              <p className="mb-0">
                +91 8976702315 / +91 7400056461
                <br />
                +91 9320445534 / +91 8097593948
              </p>
            </div>
            <div className="mb-3 bg-primary bg-opacity-75 p-3 rounded">
              <i className="bi bi-envelope-fill me-2"></i>
              <p className="mb-0">support@bidnow.com</p>
            </div>
            <div className="mb-3 bg-primary bg-opacity-75 p-3 rounded">
              <i className="bi bi-geo-alt-fill me-2"></i>
              <p className="mb-0">123 Auction St, Bid City, BC 1234</p>
            </div>
            <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />
            <p>Connect with us:</p>
            <div className="fs-5">
              <i className="bi bi-twitter me-3"></i>
              <i className="bi bi-facebook me-3"></i>
              <i className="bi bi-whatsapp me-3"></i>
              <i className="bi bi-envelope-paper me-3"></i>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
