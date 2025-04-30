import React from 'react';
import { Card, Col, Row, Spin, Statistic } from 'antd';
import { TeamOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap'; // React-Bootstrap

const Dashboard = () => {
  const { customarData = [] } = useSelector(state => state.customare) || {};
  const { payments = [] } = useSelector(state => state.payment) || {};
  const { loading } = useSelector(state => state.loading)

  // Total Paid Amount calculation from payments slice
  const totalPaidAmount = payments.reduce((acc, curr) => acc + (curr.totalPaidAmount || 0), 0);

  // Total Due Amount calculation from payments slice
  const totalDueAmount = payments.reduce((acc, curr) => acc + (curr.dueAmount > 0 ? curr.dueAmount : 0), 0);

  const dashboardStats = [
    {
      title: "Total Customers",
      value: customarData.length,
      icon: <TeamOutlined />,
    },
    {
      title: "Pain Amount(₹)",
      value: totalPaidAmount,
      icon: <DollarOutlined />,
    },
    {
      title: "Pending Dues (₹)",
      value: totalDueAmount,
      icon: <WarningOutlined />,
      valueStyle: { color: '#cf1322' },
    }
  ];
  return (
    <Container fluid className="py-4">
      {
        loading ? (
          <div style={{ textAlign: 'center', marginTop: '180px' }}>
            <Spin tip="Loading..." size="large" />
          </div>
        ) : (

          <Row gutter={[16, 16]}>
            {dashboardStats.map((stat, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                    valueStyle={stat.valueStyle}
                  />
                </Card>
              </Col>
            ))}
          </Row>)
      }
    </Container>
  );
};

export default Dashboard;
