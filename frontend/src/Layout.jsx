import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { ThemeProvider } from "./components/themeProvider.jsx";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, logout } from './features/authSlice.js';
import { Toaster } from "@/components/ui/toaster";

function Layout() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getCurrentUser = () => {
    axios.get('/api/v1/user/currentUser')
      .then(response => {
        if (response.data.payload) {
          dispatch(login(response.data.payload));
        } else {
          dispatch(logout());
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error fetching current user:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Header />
          <hr />
          <Outlet />
          <hr />
          <Toaster />
          <Footer />
        </>
      )}
    </ThemeProvider>
  );
}

export default Layout;
