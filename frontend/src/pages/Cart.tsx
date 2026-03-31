import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, InputNumber, Popconfirm, Typography, Row, Col, Card } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getCart, updateQuantity, removeFromCart, type CartItem } from '../utils/cart';
import { formatCurrency } from '../utils/formatCurrency';

const { Title, Text } = Typography;

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const handleQuantityChange = (productId: string | number, value: number | null) => {
    if (value && value > 0) {
      updateQuantity(productId, value);
    }
  };

  const handleRemove = (productId: string | number) => {
    removeFromCart(productId);
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'name',
      render: (text: string, record: CartItem) => (
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded shrink-0 flex items-center justify-center border border-gray-200">
            <ShoppingCartOutlined className="text-xl text-gray-400" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{text}</div>
            <div className="text-gray-500 text-sm">Model: {record.product.model}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Price',
      dataIndex: ['product', 'price'],
      key: 'price',
      width: 150,
      render: (price: number) => <span className="font-medium">{formatCurrency(price)}</span>
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: 150,
      render: (_: any, record: CartItem) => (
        <InputNumber
          min={1}
          max={99}
          value={record.quantity}
          onChange={(val) => handleQuantityChange(record.product.id, val)}
        />
      )
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: 150,
      render: (_: any, record: CartItem) => {
        const subtotal = record.product.price * record.quantity;
        return <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_: any, record: CartItem) => (
        <Popconfirm
          title="Remove item?"
          description="Are you sure you want to remove this item from your cart?"
          onConfirm={() => handleRemove(record.product.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="pt-6 w-full animate-fade-in max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title level={2} className="mb-1!">Shopping Cart</Title>
          <Text className="text-gray-500">Review your items before checkout</Text>
        </div>
        <Button 
          type="default" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
      </div>

      <Row gutter={[32, 24]}>
        <Col xs={24} lg={16}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Table
              columns={columns}
              dataSource={cartItems}
              rowKey={(record) => record.product.id.toString()}
              pagination={false}
              locale={{ emptyText: 'Your cart is empty' }}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title={<span className="font-semibold">Order Summary</span>} className="shadow-sm border-gray-100 rounded-xl sticky top-6">
            <div className="flex justify-between mb-4">
              <Text className="text-gray-600">Total Items:</Text>
              <Text className="font-medium">{totalItems}</Text>
            </div>
            <div className="flex justify-between mb-6 pb-6 border-b border-gray-100">
              <Text className="text-gray-600">Total Price:</Text>
              <Title level={3} className="mb-0! text-indigo-600">{formatCurrency(totalPrice)}</Title>
            </div>
            
            <Button
              type="primary"
              size="large"
              className="w-full h-12 text-lg"
              disabled={cartItems.length === 0}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
