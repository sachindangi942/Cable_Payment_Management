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

const Dashboard = () => {
  const { customarData = [] } = useSelector(state => state.customare) || {};
  const { payments = [] } = useSelector(state => state.payment) || {};

  // Total paid amount calculation from payments
  const totalPaidAmount = payments.reduce((acc, customer) => {
    const customerPaid = customer.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    return acc + customerPaid;
  }, 0);

    // Total Pending Due
    const totalDueAmount = payments.reduce((total, payment) => {
      const due = (payment.plan || 0) - (payment.paidAmount || 0);
      return total + (due > 0 ? due : 0);
    }, 0);

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
    <div style={{ padding: 24 }}>
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
    </div>
  );
};

export default Dashboard;
