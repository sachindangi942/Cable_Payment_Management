import React from 'react';
import { Table, Button, Space, Popconfirm, Form, } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const CustomerTable = ({ data, onEdit, onDelete, onPaidAmountChange, pagination, setPagination }) => {
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Sr.",
      render: (text, record, index) => index + 1
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : 'N/A',
    },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Mobile', dataIndex: 'mobile' },
    { title: 'Cart Number', dataIndex: 'cartNumber' },
    { title: 'Plan', dataIndex: 'plan' },
    {
      title: 'Action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => onDelete(record.mobile)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              <DeleteOutlined />
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
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data.length,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize })
        }}
      />
    </Form>
  );
};

export default CustomerTable;


