import React from 'react';
import { Layout } from 'antd';
import { Container } from 'react-bootstrap'; // React-Bootstrap
import TextMotion from './FramerMotion/TextMotion';

const { Header } = Layout;

const HeaderBar = () => {
  return (
    <Header  style={{ background: '#fff', padding: 0, textAlign: 'center' }}>
      <Container fluid className="">
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}><TextMotion text=" Welcome to Cable Payment Management System"/></h2>
      </Container>
    </Header>
  );
};

export default HeaderBar;
