import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin } from 'antd';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../components/firebase';
import dayjs from 'dayjs';

const COLORS = ['#0088FE', '#FF8042'];

const MonthlyReport = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const groupByMonth = (customers) => {
    const monthlyStats = {};

    customers.forEach(customer => {
      const planAmount = customer.plan || 0;
      const payments = customer.payments || [];

      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const due = Math.max(planAmount - totalPaid, 0);

      payments.forEach(payment => {
        const month = dayjs(payment.date).format('MMM'); // e.g. Jan, Feb
        if (!monthlyStats[month]) {
          monthlyStats[month] = { paid: 0, due: 0 };
        }
        monthlyStats[month].paid += payment.amount;
      });

      // Distribute due to latest month with no payment
      if (payments.length > 0) {
        const latestPaymentMonth = dayjs(payments[payments.length - 1].date).format('MMM');
        monthlyStats[latestPaymentMonth].due += due;
      }
    });

    const formatted = Object.entries(monthlyStats).map(([month, values]) => ({
      month,
      ...values
    }));

    return formatted.sort((a, b) => dayjs(a.month, 'MMM') - dayjs(b.month, 'MMM'));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'customers'));
        const customers = snapshot.docs.map(doc => doc.data());
        const monthly = groupByMonth(customers);
        setMonthlyData(monthly);
      } catch (error) {
        console.error("Error fetching data for MonthlyReport:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPaid = monthlyData.reduce((acc, cur) => acc + cur.paid, 0);
  const totalDue = monthlyData.reduce((acc, cur) => acc + cur.due, 0);

  return (
    <div style={{ padding: 24 }}>
      {
        loading ? (
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <Spin tip="Loading report..." size="large" fullscreen />
          </div>
        ) : (
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Monthly Collection (Bar)">
                <BarChart width={450} height={300} data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="paid" fill="#82ca9d" name="Paid (₹)" />
                  <Bar dataKey="due" fill="#f44336" name="Due (₹)" />
                </BarChart>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Total Report (Pie)">
                <PieChart width={400} height={300}>
                  <Pie
                    data={[
                      { name: 'Paid', value: totalPaid },
                      { name: 'Due', value: totalDue }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Card>
            </Col>
          </Row>
        )
      }
    </div>
  );
};

export default MonthlyReport;
