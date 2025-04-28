// import React from 'react';
// import { Card, Col, Row, Statistic } from 'antd';
// import { TeamOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';

// const Dashboard = () => {
//   const { customarData } = useSelector(state => state.customare)
// const {payments} = useSelector(state=>state.payment)
//   // Calculate the total payment amounts with validation
//   const paidAmounts = customarData.reduce((acc, transaction) => {
//     if (transaction.paidAmount && typeof transaction.paidAmount === 'number') {
//       return acc + transaction.paidAmount;
//     }
//     return acc; // If paidAmount is invalid, skip this transaction
//   }, 0);
//  const pandingAmounts = customarData.reduce((acc,transaction)=>{
//   console.log(  "type of ", typeof transaction.dueAmount)
//   if(transaction.dueAmount && typeof transaction.dueAmount === "number"){
//     return acc + transaction.dueAmount
//   }
//   return acc;
//  },0)
//  console.log("payments",payments)
//   return (
//     <div style={{ padding: 24 }}>
//       <Row gutter={[16, 16]}>
//         <Col xs={24} sm={12} md={8}>
//           <Card>
//             <Statistic
//               title="Total Customers"
//               value={customarData.length}
//               prefix={<TeamOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={8}>
//           <Card>
//             <Statistic
//               title="Total Payments (₹)"
//               value={paidAmounts}
//               prefix={<DollarOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={8}>
//           <Card>
//             <Statistic
//               title="Pending Dues"
//               value={pandingAmounts}
//               prefix={<WarningOutlined />}
//               valueStyle={{ color: '#cf1322' }}
//             />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Dashboard;


import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { TeamOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap'; // React-Bootstrap

const Dashboard = () => {
  const { customarData = [] } = useSelector(state => state.customare) || {};
  const { payments = [] } = useSelector(state => state.payment) || {};

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
      title: "Total Payments (₹)",
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
    </Container>
  );
};

export default Dashboard;
