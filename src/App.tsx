import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { AppLayout } from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import TradingTerminal from './pages/TradingTerminal';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-1/3 top-0 h-[60vh] w-[60vw] rounded-full bg-primary-600/20 blur-[180px]" />
      <div className="absolute right-[-20vw] top-10 h-[55vh] w-[55vw] rounded-full bg-accent-500/20 blur-[180px]" />
      <div className="absolute inset-x-0 bottom-[-30vh] h-[60vh] bg-gradient-to-t from-primary-500/10 via-transparent to-transparent" />
    </div>
  );
}

function App() {
  return (
    <div className="relative min-h-screen bg-background text-white">
      <Background />
      <ScrollToTop />
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trade" element={<TradingTerminal />} />
        </Routes>
      </AppLayout>
    </div>
  );
}

export default App;
