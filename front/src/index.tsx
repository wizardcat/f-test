import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from './components/Login/login.component';
import { Register } from './components/Register/register.component';
import { User } from './components/User/user.component.';
import './index.css';
import { AuthProvider } from './providers/auth.provider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    <ToastContainer />
  </React.StrictMode>,
);
