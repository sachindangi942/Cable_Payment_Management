import React from 'react';
import { Layout } from 'antd';
import { Container } from 'react-bootstrap'; // React-Bootstrap

const { Header } = Layout;

const HeaderBar = () => {
  return (
    <Header style={{ background: '#fff', padding: 0, textAlign: 'center' }}>
      <Container className="py-2">
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Cable Payment Management</h2>
      </Container>
    </Header>
  );
};

export default HeaderBar;
