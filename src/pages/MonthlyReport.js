// src/pages/MonthlyReport.jsx
import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  { month: 'Jan', paid: 12000, due: 2000 },
  { month: 'Feb', paid: 14000, due: 1000 },
  { month: 'Mar', paid: 10000, due: 3000 },
];

const COLORS = ['#0088FE', '#FF8042'];

const pieData = [
  { name: 'Paid', value: 36000 },
  { name: 'Due', value: 6000 },
];

const MonthlyReport = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Monthly Collection (Bar)">
            <BarChart width={450} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="paid" fill="#82ca9d" />
              <Bar dataKey="due" fill="#f44336" />
            </BarChart>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Report (Pie)">
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MonthlyReport;
