import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';

import About from './pages/About';
import Bookings from './pages/Bookings';
import Checkout from './pages/Checkout';
import FAQ from './pages/FAQ';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import PropertyDetail from './pages/PropertyDetail';
import Saved from './pages/Saved';
import Stays from './pages/Stays';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Old checkout links used ?bookingId=…; keep them working.
function LegacyCheckout() {
  const [params] = useSearchParams();
  const id = params.get('bookingId');
  return <Navigate to={id ? `/checkout/${id}` : '/bookings'} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stays" element={<Stays />} />
        <Route path="/single/:id" element={<PropertyDetail />} />
        <Route path="/checkout/:bookingId" element={<Checkout />} />
        <Route path="/checkout" element={<LegacyCheckout />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/trendingsection" element={<Navigate to="/stays" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
