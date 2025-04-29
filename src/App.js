import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import {  Layout,} from 'antd';
import { auth } from './components/firebase'; // Firebase Auth import करें

import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Payments from './pages/Payments';
import MonthlyReport from './pages/MonthlyReport';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';


const { Sider, Content } = Layout;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Firebase auth state change listener
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);



  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {isAuthenticated && (
          <Sider breakpoint="lg" collapsedWidth="0" className='py-3 gap-4'>
            <Sidebar />
          </Sider>
        )}
        <Layout>
          {isAuthenticated && <HeaderBar />}
          <Content style={{ margin: '16px' }}>
            <Routes>
              <Route
                path="/"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" /> : <LoginForm />}
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/" /> : <RegistrationForm />}
              />
              <Route
                path="/customers"
                element={isAuthenticated ? <Customers /> : <Navigate to="/login" />}
              />
              <Route
                path="/payments"
                element={isAuthenticated ? <Payments /> : <Navigate to="/login" />}
              />
              <Route
                path="/report"
                element={isAuthenticated ? <MonthlyReport /> : <Navigate to="/login" />}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;

