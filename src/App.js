import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopMenu from './components/TopMenu';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login'; // Import the Login component
import './components/TopMenu.css';
import './components/Footer.css';
import './App.css';

import TourBooking from './components/TourBooking';

import RecommendedPlaces from './components/RecommendedPlaces';
import Articles from './components/Articles';
import Promotions from './components/Promotions';
import Packages from './components/Packages';
import Gallery from './components/Gallery';
import Programs from './components/Program';

import Banner from './components/Banner';
import RoomSelection from './components/RoomSelection';
import TourList from './components/TourList';

import TourCard from './components/TourCard';
import AdBanner from './components/AdBanner';
import ImageSlider from './components/ImageSlider';


const App = () => {
  return (
    <Router>
    <div className="App">
      <TopMenu />
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <div>
                <Banner />
                <AdBanner />
                <RecommendedPlaces/>
              
                <Promotions />
                <Packages/>
                <Programs/>
               
                <Gallery />
            
            
                <Footer />
              </div>
            } 
          />
          <Route path="/TourList" element={<div>
                  <RoomSelection />
                  <TourList /> 
                </div>} />
                 <Route path="/TourCard/:id" element={<div>
                  <RoomSelection />
                  <TourCard />
                  </div>} />

          <Route path="/TourBooking/:id" element={<div>
                  <RoomSelection />
                  <TourBooking /> 
                </div>} />
        
        </Routes>
      </main>
    </div>
  </Router>
       
  );
};

export default App;
