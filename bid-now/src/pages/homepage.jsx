import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import heroImage from "../img/hero.jpg";

const HeroSection = () => (
  <section
    id="home"
    className="hero-section position-relative text-white"
    style={{
      backgroundImage: `url(${heroImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
    }}
  >
    <div
      className="overlay position-absolute top-0 start-0 w-100 h-100"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    ></div>
    <div className="container position-relative z-1 text-center d-flex flex-column justify-content-center align-items-center h-100">
      <h1 className="display-4 fw-bold">Bid. Win. Celebrate.</h1>
      <p className="lead mb-4">
        Discover amazing deals in our live auction platform
      </p>
      <a href="/live-auction" className="btn btn-light btn-lg btn-custom">
        Start Bidding Now
      </a>
    </div>
  </section>
);

const categories = [
  { icon: "fas fa-car", title: "Vehicles", desc: "Cars, motorcycles, boats" },
  {
    icon: "fas fa-laptop",
    title: "Electronics",
    desc: "Phones, laptops, gadgets",
  },
  {
    icon: "fas fa-gem",
    title: "Jewelry",
    desc: "Rings, watches, collectibles",
  },
  {
    icon: "fas fa-home",
    title: "Real Estate",
    desc: "Houses, land, commercial",
  },
];

const CategoriesSection = () => (
  <section id="categories" className="py-5">
    <div className="container">
      <div className="text-center mb-5">
        <h2>Browse Categories</h2>
        <p className="lead">Find exactly what you're looking for</p>
      </div>
      <div className="row">
        {categories.map((cat, idx) => (
          <div className="col-md-3 mb-4" key={idx}>
            <div className="card category-card h-100 text-center p-4">
              <i className={`${cat.icon} category-icon`}></i>
              <h5>{cat.title}</h5>
              <p>{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const sampleAuctions = [
  {
    id: 1,
    title: "Vintage Watch",
    currentBid: 250,
    bids: 15,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop",
    timeLeftOffset: 3600000,
  },
  {
    id: 2,
    title: "Gaming Laptop",
    currentBid: 800,
    bids: 23,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    timeLeftOffset: 7200000,
  },
  {
    id: 3,
    title: "BMW M3 Competition",
    currentBid: 48000,
    bids: 31,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
    timeLeftOffset: 6 * 60 * 60 * 1000,
  },
];

const formatTimeRemaining = (endTime) => {
  const now = new Date();
  const diff = endTime - now;
  if (diff <= 0) return "Auction Ended";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
};

const FeaturedAuctionsSection = () => {
  const [auctions, setAuctions] = useState(
    sampleAuctions.map((a) => ({
      ...a,
      endTime: new Date(Date.now() + a.timeLeftOffset),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => setAuctions((prev) => [...prev]), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="auctions" className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2>Featured Auctions</h2>
          <p className="lead">Don't miss out on these hot items!</p>
        </div>
        <div className="row">
          {auctions.map((auction) => (
            <div className="col-md-6 col-lg-4 mb-4" key={auction.id}>
              <div className="card auction-card h-100">
                <img
                  src={auction.image}
                  className="card-img-top"
                  alt={auction.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{auction.title}</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-success fw-bold">
                      ${auction.currentBid}
                    </span>
                    <small className="text-muted">{auction.bids} bids</small>
                  </div>
                  <div className="countdown mb-3">
                    <small className="text-danger fw-bold">
                      {formatTimeRemaining(auction.endTime)}
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm flex-fill"
                      onClick={() =>
                        alert(`Bid placed on auction ${auction.id}`)
                      }
                    >
                      <i className="fas fa-gavel"></i> Bid Now
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        alert(`Item ${auction.id} added to watchlist!`)
                      }
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <a href="/live-auction" className="btn btn-primary btn-custom">
            View All Auctions
          </a>
        </div>
      </div>
    </section>
  );
};

const steps = [
  {
    icon: "fas fa-user-plus",
    title: "Register",
    desc: "Create your free account in seconds",
  },
  {
    icon: "fas fa-search",
    title: "Browse",
    desc: "Find items you love in our categories",
  },
  {
    icon: "fas fa-gavel",
    title: "Bid & Win",
    desc: "Place bids and win amazing items",
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-5">
    <div className="container">
      <div className="text-center mb-5">
        <h2>How It Works</h2>
        <p className="lead">Simple steps to start bidding</p>
      </div>
      <div className="row">
        {steps.map((step, idx) => (
          <div className="col-md-4 text-center mb-4" key={idx}>
            <div className="mb-3">
              <i className={`${step.icon} fa-3x text-primary`}></i>
            </div>
            <h5>{`${idx + 1}. ${step.title}`}</h5>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedAuctionsSection />
      <HowItWorksSection />
      <Footer />
    </>
  );
};

export default HomePage;
