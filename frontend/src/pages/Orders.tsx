import React, { useState, useEffect } from 'react';
import { Table, Tag, Segmented, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { getOrders } from '../services/api';
import type { Order, OrderStatus } from '../types/order';

export const Orders: React.FC = () => {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<OrderStatus>('PLACED');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders({ page, limit, status });
      // Determine if response is direct array or Object based on typical Pagination implementations
      if (Array.isArray(response)) {
        setData(response as unknown as Order[]);
        setTotal(response.length); // fallback if no total provided
      } else {
        setData(response.data || []);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, status]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current && pagination.pageSize) {
      setPage(pagination.current);
      setLimit(pagination.pageSize);
    }
  };

  const statusOptions = ['PLACED', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  const columns: ColumnsType<Order> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-semibold text-gray-800">{text || '-'}</span>,
    },
    {
      title: 'Total Amount (LKR)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => val !== undefined && val !== null ? val.toLocaleString('en-LK', { minimumFractionDigits: 2 }) : '0.00',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (statusString: string) => {
        let color = 'default';
        if (statusString === 'DELIVERED') color = 'success';
        if (statusString === 'PROCESSING') color = 'processing';
        if (statusString === 'SHIPPED') color = 'cyan';
        if (statusString === 'PENDING') color = 'warning';
        if (statusString === 'PLACED') color = 'geekblue';
        return <Tag color={color}>{statusString || 'UNKNOWN'}</Tag>;
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (dateStr: string) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        
        // Format as YYYY-MM-DD HH:mm
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
      },
    },
  ];

  return (
    <div className="pt-10 w-full animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orders Management</h2>
          <p className="text-gray-500 mt-2">View and manage customer orders (Admin Only)</p>
        </div>
        <div className="flex justify-end pr-1">
          <Segmented
            options={statusOptions}
            value={status}
            onChange={(value) => {
              setStatus(value as OrderStatus);
              setPage(1);
            }}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 relative">
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id"
          loading={loading}
          pagination={{ 
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};
