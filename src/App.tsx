/**
 * Atomic Explore Web
 * Main application component with routing
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  AccountPage,
  TransfersPage,
  PaymentsPage,
  ServicesPage,
  SettingsPage,
} from './pages';
import { atomicService } from './services/atomicService';
import './styles/global.css';

// Handle SPA redirect from 404.html
function SpaRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.getItem('spa-redirect');
    if (redirect) {
      sessionStorage.removeItem('spa-redirect');
      // Remove the basename from the path
      const path = redirect.replace('/atomic-explore-web', '') || '/';
      navigate(path, { replace: true });
    }
  }, [navigate]);

  return null;
}

function App() {
  // Initialize Atomic SDK on app load
  useEffect(() => {
    atomicService.initialize();

    // Restore theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
    // If no saved preference, system preference is used via CSS media query
  }, []);

  return (
    <BrowserRouter basename="/atomic-explore-web">
      <SpaRedirectHandler />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AccountPage />} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
