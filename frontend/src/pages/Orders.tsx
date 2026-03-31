import React, { useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface MockOrder {
  id: string;
  totalAmount: number;
  createdDate: string;
  status: 'DELIVERED' | 'PROCESSING' | 'SHIPPED' | 'CANCELLED';
}

const mockData: MockOrder[] = [
  { id: 'ORD-001', totalAmount: 15200.00, createdDate: '2026-03-31', status: 'DELIVERED' },
  { id: 'ORD-002', totalAmount: 4350.50, createdDate: '2026-03-30', status: 'PROCESSING' },
  { id: 'ORD-003', totalAmount: 8900.00, createdDate: '2026-03-29', status: 'SHIPPED' },
  { id: 'ORD-004', totalAmount: 1200.00, createdDate: '2026-03-28', status: 'CANCELLED' },
  { id: 'ORD-005', totalAmount: 24700.00, createdDate: '2026-03-28', status: 'PROCESSING' },
];

export const Orders: React.FC = () => {
  const [data] = useState<MockOrder[]>(mockData);

  const columns: ColumnsType<MockOrder> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: 'Total Amount (LKR)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => val.toLocaleString('en-LK', { minimumFractionDigits: 2 }),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'DELIVERED') color = 'success';
        if (status === 'PROCESSING') color = 'processing';
        if (status === 'SHIPPED') color = 'cyan';
        if (status === 'CANCELLED') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="pt-10 w-full animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orders Management</h2>
          <p className="text-gray-500 mt-2">View and manage customer orders (Admin Only)</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};
