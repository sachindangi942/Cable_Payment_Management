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



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';

import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Payments from './pages/Payments';
import MonthlyReport from './pages/MonthlyReport';

const { Sider, Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0" className='py-3 gap-4' >
          <Sidebar />
        </Sider>
        <Layout>
          <HeaderBar />
          <Content style={{ margin: '16px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/report" element={<MonthlyReport />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
