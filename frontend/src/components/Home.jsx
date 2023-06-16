import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Jobs from './Jobs';
import Extra from './Extra';
import Footer from './Footer';
import About from './About';

function Home() {
  return (
    <div className="Home">
        <div>
        <Navbar />
        <Hero />
        <Jobs />
        <Extra />
        <About />
        <Footer />
        </div>
    </div>
  );
}

export default Home;
