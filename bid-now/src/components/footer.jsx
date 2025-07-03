import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5><i className="fas fa-gavel"></i> BidNow</h5>
            <p>The premier online auction platform where buyers and sellers meet to create amazing deals.</p>
            <div className="social-links">
              <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div className="col-md-2 mb-4">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white-50">Home</a></li>
              <li><a href="#" className="text-white-50">Auctions</a></li>
              <li><a href="#" className="text-white-50">Categories</a></li>
              <li><a href="#" className="text-white-50">Sell</a></li>
            </ul>
          </div>
          <div className="col-md-2 mb-4">
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white-50">Help Center</a></li>
              <li><a href="#" className="text-white-50">Contact Us</a></li>
              <li><a href="#" className="text-white-50">Terms</a></li>
              <li><a href="#" className="text-white-50">Privacy</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h6>Contact Info</h6>
            <div className="mb-2"><i className="fas fa-phone me-2"></i> <span>+1 (555) 123-4567</span></div>
            <div className="mb-2"><i className="fas fa-envelope me-2"></i> <span>support@bidnow.com</span></div>
            <div className="mb-2"><i className="fas fa-map-marker-alt me-2"></i> <span>123 Auction St, Bid City, BC 12345</span></div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center">
          <p>&copy; 2025 BidNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
