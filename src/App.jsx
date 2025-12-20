import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Lineup from './components/Lineup';
import Tickets from './components/Tickets';
import Experience from './components/Experience';
import Location from './components/Location';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

import Admin from './components/Admin';

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage = () => (
  <>
    <Hero />
    <Gallery />
  </>
);

function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin';

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon-pink selection:text-white overflow-x-hidden font-sans flex flex-col">
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? "flex-grow pt-20" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/lineup" element={<Lineup />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/location" element={<Location />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <ScrollToTop />
    <App />
  </Router>
);

export default AppWrapper;
