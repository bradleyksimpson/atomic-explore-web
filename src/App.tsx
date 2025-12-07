/**
 * Atomic Explore Web
 * Main application component with routing
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    <BrowserRouter>
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
