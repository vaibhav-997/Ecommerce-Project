import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoutesFromElements, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './features/store.js';
import './index.css';

import Layout from './Layout.jsx';
import Home from './components/Home/Home.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import Login from './components/Login/Login.jsx';
import AddProducts from './components/admin/AddProducts/AddProducts.jsx';
import Category from './components/Category/Category.jsx';
import ProductsByCategory from './components/Category/[category]/ProductsByCategory.jsx'; // Corrected path
import ProductById from './components/Category/[productId]/ProductById.jsx'; // Corrected path
import AuthLayout from './components/AuthLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx'
import Profile from './components/User/Profile/Profile.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      
        <Route path="/signup" element={<AuthLayout authentication={false}><SignUp /></AuthLayout>} />
      
      <Route path="/login" element={<AuthLayout authentication={false}><Login /></AuthLayout>} />
      <Route path="/add-product" element={<AuthLayout authentication={true}><AdminLayout admin={true}><AddProducts /></AdminLayout></AuthLayout>} />
      <Route path="/update-product/:id" element={<AuthLayout authentication={true}><AdminLayout admin={true}><AddProducts /></AdminLayout></AuthLayout>} />
      

      <Route path="/category" element={<Category />} />
      <Route path="/products/:category" element={<ProductsByCategory />} />
      <Route path="/product/:id" element={<ProductById />} />
      <Route path="/profile" element={<AuthLayout><Profile /></AuthLayout>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <Router>
          <Routes>{router}</Routes>
        </Router>
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
