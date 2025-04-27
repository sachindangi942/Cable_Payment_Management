import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Container } from 'react-bootstrap'; // React-Bootstrap

const items = [
  {
    key: '1',
    icon: <DashboardOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: '2',
    icon: <TeamOutlined />,
    label: <Link to="/customers">Customers</Link>,
  },
  {
    key: '3',
    icon: <DollarOutlined />,
    label: <Link to="/payments">Payments</Link>,
  },
  {
    key: '4',
    icon: <BarChartOutlined />,
    label: <Link to="/report">Monthly Report</Link>,
  },
];

const Sidebar = () => {
  return (
    <div style={{ backgroundColor: '#001529', height: '100%' }}>
      <Container className="my-4">
        <div className="logo" style={{ height: 32, margin: 16, color: 'white', fontWeight: 'bold' }}>
          Cable App
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
      </Container>
    </div>
  );
};

export default Sidebar;
