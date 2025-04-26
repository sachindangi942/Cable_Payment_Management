// import React from 'react';
// import { Table, Tag, Button, Space, Popconfirm } from 'antd';

// const CustomerTable = ({ data, onEdit, onDelete }) => {
//   const columns = [
//     {
//       title: 'Date',
//       dataIndex: 'date',
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//     },
//     {
//       title: 'Mobile',
//       dataIndex: 'mobile',
//     },
//     {
//       title: 'Cart Number',
//       dataIndex: 'cartNumber',
//     },
//     {
//       title: 'Plan',
//       dataIndex: 'plan',
//       // render: (plan) => <Tag color="blue">{plan}</Tag>,
//     },
//     {
//       title: 'Paid Amount',
//       dataIndex: 'paidAmount',
//     },
//     {
//       title: 'Action',
//       render: (_, record) => (
//         <Space>
//           <Button type="link" onClick={() => onEdit(record)}>
//             Edit
//           </Button>
//           <Popconfirm
//             title="Are you sure to delete this customer?"
//             onConfirm={() => onDelete(record.mobile)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button type="link" danger>
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return <Table columns={columns} dataSource={data} rowKey="mobile" />;
// };

// export default CustomerTable;


// CustomerTable.jsx

import React from 'react';
import { Table, Button, Space, Popconfirm, Form, InputNumber, message } from 'antd';

const CustomerTable = ({ data, onEdit, onDelete, onPaidAmountChange }) => {
  const [form] = Form.useForm();

  const handleSave = async (mobile, plan) => {
    try {
      const values = await form.validateFields([`paidAmount_${mobile}`]);
      const paidAmount = values[`paidAmount_${mobile}`];

      if (paidAmount > plan) {
        message.warning('Paid amount cannot be greater than plan amount');
        return;
      }

      if (paidAmount > 0) {
        onPaidAmountChange(mobile, paidAmount, plan);
      }

      // Clear the input field
      form.resetFields([`paidAmount_${mobile}`]);
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
    }
  };

  const columns = [
    { title: 'Date', dataIndex: 'date' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Mobile', dataIndex: 'mobile' },
    { title: 'Cart Number', dataIndex: 'cartNumber' },
    { title: 'Plan', dataIndex: 'plan' },
    {
      title: 'Paid Amount',
      dataIndex: 'paidAmount',
      render: (_, record) => (
        <Form.Item
          name={`paidAmount_${record.mobile}`}
          initialValue={null}  // Always start empty
          rules={[
            { required: true, message: 'Please enter Paid Amount' },
          ]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            min={0}
            max={Number(record.plan) || undefined}
            placeholder="Enter Paid Amount"
            onPressEnter={() => handleSave(record.mobile, record.plan)}
            onBlur={() => handleSave(record.mobile, record.plan)}
            style={{ width: '100%' }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Due Amount',
      render: (_, record) => {
        const planAmount = Number(record.plan) || 0;
        const paidAmount = Number(record.paidAmount) || 0;
        const dueAmount = planAmount - paidAmount;
        return <span style={{ color: dueAmount > 0 ? 'red' : 'green' }}>{dueAmount}</span>;
      },
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => onDelete(record.mobile)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="mobile"
        scroll={{ x: true }}
        bordered
      />
    </Form>
  );
};

export default CustomerTable;



