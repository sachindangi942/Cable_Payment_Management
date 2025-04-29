// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { Layout, Menu } from 'antd';
// import {
//   DashboardOutlined,
//   TeamOutlined,
//   DollarOutlined,
//   BarChartOutlined,
// } from '@ant-design/icons';

// import Dashboard from './pages/Dashboard';
// import Customers from './pages/Customers';
// import Payments from './pages/Payments';
// import MonthlyReport from './pages/MonthlyReport'; // Import the MonthlyReport component
// // import EditCustomerModal from './components/EditCustomerModal'; // Import the EditCustomerModal component

// const { Header, Sider, Content } = Layout;

// const App = () => {
//   return (
//     <Router>
//       <Layout style={{ minHeight: '100vh' }}>
//         <Sider breakpoint="lg" collapsedWidth="0">
//           <div className="logo" style={{ height: 32, margin: 16, color: 'white', fontWeight: 'bold' }}>
//             Cable App
//           </div>
//           <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
//             <Menu.Item key="1" icon={<DashboardOutlined />}>
//               <Link to="/">Dashboard</Link>
//             </Menu.Item>
//             <Menu.Item key="2" icon={<TeamOutlined />}>
//               <Link to="/customers">Customers</Link>
//             </Menu.Item>
//             <Menu.Item key="3" icon={<DollarOutlined />}>
//               <Link to="/payments">Payments</Link>
//             </Menu.Item>
//             <Menu.Item key="4" icon={<BarChartOutlined />}>
//               <Link to="/report">Monthly Report</Link>
//             </Menu.Item>
//           </Menu>
//         </Sider>
//         <Layout>
//           <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontSize: '1.5rem' }}>
//             Cable Payment Management
//           </Header>
//           <Content style={{ margin: '16px' }}>
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/customers" element={<Customers />} />
//               <Route path="/payments" element={<Payments />} />
//               <Route path="/report" element={<MonthlyReport />} />
//             </Routes>
//           </Content>
//         </Layout>
//       </Layout>
//     </Router>
//   );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import { Button, Layout, notification } from 'antd';
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
          <Button
            onClick={() => {
              notification.success({
                message: "Test Notification",
                description: "It works!",
                placement: "topRight",
              });
            }}
          >
            Show Test Notification
          </Button>

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

