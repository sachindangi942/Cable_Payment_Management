import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Container } from 'react-bootstrap'; // React-Bootstrap
import { CustomDrawer } from './drawers/CustomeDrawer';



const Sidebar = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerVisible(true)
  };
  const handleDrawerClose = () => {
    setIsDrawerVisible(false)
  }

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
    {
      key: '5',
      icon: <SettingOutlined />,
      label: <span onClick={handleDrawerOpen}>Setting</span>
    }
  ];

  return (
    <div style={{ backgroundColor: '#001529', height: '100%' }}>
      <Container className="my-4">
        <div className="logo" style={{ height: 32, margin: 16, color: 'white', fontWeight: 'bold' }}>
          Cable App
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
        <CustomDrawer closeDrawer={handleDrawerClose} isDrawerVisible={isDrawerVisible} />
      </Container>
    </div>
  );
};

export default Sidebar;
