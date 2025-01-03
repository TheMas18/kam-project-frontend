import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Router components
import NavBar from './components/NavBar';


import websiteLogo from './assets/images/udaan_logo.jpg'
import HomePage from './pages/HomePage';
import CallPlanning from './pages/CallPlanning';
import PerformanceTracking from './pages/PerformanceTracking';

const RestaurantPage = lazy(() => import('./pages/RestaurantPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const InteractionPage = lazy(() => import('./pages/InteractionPage'));
const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        
        <aside id="dashboard-menu">
          <div className="dashboard-logo">
            <img src={websiteLogo} alt="Udaan Logo" />
            <h2>Udaan</h2>
          </div>
          <ul className="menu-items">
            <Link to="/" className='link-design'><li><i className="fa-solid fa-house-user"></i>home</li></Link>
            <Link to="/restaurant"  className='link-design'><li><i className="fa-solid fa-utensils"></i>Restaurants</li></Link>
            <Link to="/contact"  className='link-design'><li><i className="fa-solid fa-user"></i>Contacts</li></Link>
            <Link to="/interactions"  className='link-design'><li><i className="fa-solid fa-comments"></i>Interactions</li></Link>
            <Link to="/callPlanning"  className='link-design'><li><i className="fa-solid fa-phone"></i>Calls</li></Link>
            <Link to="/performanceTracking"  className='link-design'><li><i className="fa-solid fa-chart-bar"></i>Performance Tracking</li></Link>

          </ul>
        </aside>

        {/* Main Content */}
        <main id="dashboard-interface">
          <NavBar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurant" element={<RestaurantPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/interactions" element={<InteractionPage />} />
              <Route path="/callPlanning" element={<CallPlanning />} />
              <Route path="/performanceTracking" element={<PerformanceTracking />} />

            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};
export default App;