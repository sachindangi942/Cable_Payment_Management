// import React from 'react';
// import { Card, Col, Row, Spin, Statistic } from 'antd';
// import { TeamOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';
// import { Container } from 'react-bootstrap'; // React-Bootstrap

// const Dashboard = () => {
//   const { customarData = [] } = useSelector(state => state.customare) || {};
//   const { payments = [] } = useSelector(state => state.payment) || {};
//   const { loading } = useSelector(state => state.loading)

//   // Total Paid Amount calculation from payments slice
//   const totalPaidAmount = payments.reduce((acc, curr) => acc + (curr.totalPaidAmount || 0), 0);

//   // Total Due Amount calculation from payments slice
//   const totalDueAmount = payments.reduce((acc, curr) => acc + (curr.dueAmount > 0 ? curr.dueAmount : 0), 0);

//   const dashboardStats = [
//     {
//       title: "Total Customers",
//       value: customarData.length,
//       icon: <TeamOutlined />,
//     },
//     {
//       title: "Pain Amount(₹)",
//       value: totalPaidAmount,
//       icon: <DollarOutlined />,
//     },
//     {
//       title: "Pending Dues (₹)",
//       value: totalDueAmount,
//       icon: <WarningOutlined />,
//       valueStyle: { color: '#cf1322' },
//     }
//   ];
//   return (
//     <Container fluid className="py-4">
//       {
//         loading ? (
//           <div style={{ textAlign: 'center', marginTop: '180px' }}>
//             <Spin tip="Loading..." size="large" />
//           </div>
//         ) : (

//           <Row gutter={[16, 16]}>
//             {dashboardStats.map((stat, index) => (
//               <Col key={index} xs={24} sm={12} md={8}>
//                 <Card>
//                   <Statistic
//                     title={stat.title}
//                     value={stat.value}
//                     prefix={stat.icon}
//                     valueStyle={stat.valueStyle}
//                   />
//                 </Card>
//               </Col>
//             ))}
//           </Row>)
//       }
//     </Container>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Statistic } from 'antd';
import { TeamOutlined, WarningOutlined } from '@ant-design/icons';
import { Container } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';
import "../App.css"

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'customers'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Total Paid Amount calculation from all customers
  const totalPaidAmount = customers.reduce((acc, customer) => {
    const paid = (customer.payments || []).reduce((sum, payment) => sum + payment.amount, 0);
    return acc + paid;
  }, 0);

  // Total Due Amount calculation from all customers
  const totalDueAmount = customers.reduce((acc, customer) => {
    const paid = (customer.payments || []).reduce((sum, payment) => sum + payment.amount, 0);
    const due = customer.plan - paid;
    return acc + (due > 0 ? due : 0);
  }, 0);

  const dashboardStats = [
    {
      title: "Total Customers",
      value: customers.length,
      icon: <TeamOutlined />,
    },
    {
      title: "Paid Amount (₹)",
      value: totalPaidAmount,
      icon: "₹",
    },
    {
      title: "Pending Dues (₹)",
      value: totalDueAmount,
      icon: <WarningOutlined />,
      valueStyle: { color: '#cf1322' },
    }
  ];

  return (
    <Container fluid className="py-4 "  >
      {
        loading ? (
          <div style={{ textAlign: 'center', marginTop: '180px' }}>
            <Spin tip="Loading..." size="large" fullscreen />
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
          </Row>
        )
      }
    </Container>
  );
};

export default Dashboard;

