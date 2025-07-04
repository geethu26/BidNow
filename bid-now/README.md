# BidNow – Online Auction Platform

## Sprint 3 Summary

This repository includes code for **Sprint 3**, which focuses on breaking down the project into reusable components, enforcing code quality through ESLint, adding unit tests, and optimizing the build process using Webpack and Yarn.

---

## 🏁 Sprint Goal

Build functional components, write unit tests for auction list and bidding form, and implement linting for entire codebase and build optimizations to improve code quality and maintainability.

---

## ✅ Completed User Stories

| Story ID | User Story                                                                 | Status |
| -------- | -------------------------------------------------------------------------- | ------ |
| US-01    | As a developer, I want to build an Auction Card component with bid button | ✅ Done |
| US-02    | As a user, I want to place bids using a responsive Bidding Form           | ✅ Done |
| US-03    | As a team, we want consistent linting rules enforced across codebase      | ✅ Done |
| US-04    | As a developer, I want unit tests for Auction List and Bidding Form       | ✅ Done |
| US-05    | As a developer, I want to optimize bundling using Webpack                 | ✅ Done |
| US-06    | As a team, we want to manage packages with Yarn and update documentation  | ✅ Done |


✔️ All stories were tracked via OpenProject and marked complete.


## 🛠️Tech Stack

- **Framework:** React 18
- **Styling:** Bootstrap 5, CSS3
- **Routing:** React Router DOM v7
- **Testing:** Jest, React Testing Library
- **Linting:** ESLint with Airbnb style guide
- **Bundler:** Webpack 5
- **Package Manager:** Yarn

---

## 📂Project Directory Structure
    
    /bid-now/
    ├── dist
    ├── node_modules/
    ├── public/
    ├── src/
    │ ├── components/
    │ ├── img/
    │ ├── pages/
    │ ├── App.css
    │ ├── App.js
    │ ├── index.css
    │ ├── index.js
    │ ├── logo.svg
    │ ├── reportWebVitals.js
    │ └── setupTests.js
    ├── .eslintrc.js
    ├── .gitignore
    ├── babel.config.js
    ├── data.json
    ├── jest.config.js
    ├── package.json
    ├── README.md
    ├── webpack.config.js
    └── yarn.lock
    
## 🚀Getting Started

Follow the steps below to set up and run the project locally:

---

#### 1. Clone the Repository

    git clone https://github.com/your-username/bid-now.git
    cd bid-now
- Replace your-username with your actual GitHub username or organization.

#### 2. Install Yarn (if not installed)
    
    npm install --global yarn

#### 3. Install Project Dependencies
    yarn install

#### 4. Serve Mock Data API
We use json-server to serve auction data from data.json.

    yarn serve-data
Mock API will run at: http://localhost:5000

#### 5.  Run the Development Server
    yarn start
This starts the Webpack development server and opens the app.

#### 6. Run Linting (Code Quality Check)
    yarn lint

#### 7. Run Unit Tests
    yarn test

#### 8. Build for Production
    yarn build
Output will be in the /dist directory.

## Features Delivered in Sprint 3

- ✅ **AuctionCard** component with bid button
- ✅ **BiddingForm** with React hooks to manage state
- ✅ Configured and enforced **ESLint** rules across the project
- ✅ Added unit tests using **Jest** and **React Testing Library**
- ✅ Webpack configured for optimized builds and dev server and dist folder was also created.
- ✅ Project dependency management using **Yarn**

## Sprint Pod Members
- Geethu Joseph
- Govindh RM
- Jayashree VS
- Karthika RS
- Kushagra Srivastava
- Mayukh Paul

## 📅Sprint Details
- Sprint Number: 3
- Sprint Pod Name: BidNow – Online Auction System
- Submission Date: 4th July, 2025

## 📈 What’s Next

In the upcoming **Sprint 4**, we will focus on integrating the backend and connecting the application to a real database. Key objectives include:

- Design and implement **MongoDB schemas** for users, auctions, and bids.
- Build secure **user authentication and login** using JWT.
- Develop RESTful **APIs** for auction creation, bidding, and fetching results using **Node.js** and **Express**.
- Implement **real-time bidding logic** and automatic auction closure after a session timeout.
- Connect the frontend to backend endpoints and **persist bid data** to MongoDB.
- Create **API documentation** using Swagger or export a Postman collection.

This sprint aims to complete the backend foundation and ensure secure, real-time, database-backed auction functionality.
