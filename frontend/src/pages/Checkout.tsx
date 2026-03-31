import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col, Card, Typography, message, Divider } from 'antd';
import { getCart, clearCart, type CartItem } from '../utils/cart';
import { createOrder } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { type CheckoutPayload } from '../types/cart';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      message.warning('Your cart is empty. Please add items before checking out.');
      navigate('/cart');
    } else {
      setCartItems(items);
    }
  }, [navigate]);

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const payload: CheckoutPayload = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        recipientName: values.recipientName,
        recipientPhone: values.recipientPhone,
        recipientAddressLine1: values.recipientAddressLine1,
        recipientAddressLine2: values.recipientAddressLine2 || '',
        city: values.city,
        postalCode: values.postalCode,
        country: values.country || 'Sri Lanka',
      };

      const idempotencyKey = crypto.randomUUID();
      
      await createOrder(payload, idempotencyKey);
      
      message.success({
        content: 'Order placed successfully!',
        icon: <CheckCircleOutlined className="text-green-500" />,
        duration: 3
      });
      
      clearCart();
      form.resetFields();
      navigate('/');
      
    } catch (error: any) {
      console.error('Order checkout failed:', error);
      message.error(error?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 w-full animate-fade-in max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title level={2} className="mb-1!">Checkout</Title>
          <Text className="text-gray-500">Complete your shipping and payment details</Text>
        </div>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/cart')}
          className="text-gray-600 hover:text-gray-900"
        >
          Back to Cart
        </Button>
      </div>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={14}>
          <Card title={<span className="font-semibold text-lg">Billing & Shipping Address</span>} className="shadow-sm border-gray-100 rounded-xl">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ country: 'Sri Lanka' }}
              disabled={loading}
              requiredMark={'optional'}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="recipientName"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input size="large" placeholder="John Doe" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="recipientPhone"
                    label="Phone Number"
                    rules={[
                      { required: true, message: 'Please enter your phone number' },
                      { pattern: /^\+?[0-9\s\-]{9,15}$/, message: 'Please enter a valid phone number' }
                    ]}
                  >
                    <Input size="large" placeholder="+94 77 123 4567" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="recipientAddressLine1"
                label="Address Line 1"
                rules={[{ required: true, message: 'Please enter your street address' }]}
              >
                <Input size="large" placeholder="No 123, Galle Road" />
              </Form.Item>

              <Form.Item
                name="recipientAddressLine2"
                label="Address Line 2 (Optional)"
              >
                <Input size="large" placeholder="Apartment, suite, unit, etc." />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: 'Please enter your city' }]}
                  >
                    <Input size="large" placeholder="Colombo" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="postalCode"
                    label="Postal Code"
                    rules={[{ required: true, message: 'Please enter postal code' }]}
                  >
                    <Input size="large" placeholder="00100" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[{ required: true, message: 'Please enter country' }]}
                  >
                    <Input size="large" disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        
        <Col xs={24} lg={10}>
          <Card 
            title={<span className="font-semibold text-lg">Order Summary</span>} 
            className="shadow-sm border-gray-100 rounded-xl sticky top-6 bg-gray-50"
          >
            <div className="max-h-96 overflow-y-auto pr-2 mb-4 space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="flex justify-between items-start text-sm border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-col flex-1 pr-4">
                    <span className="font-medium text-gray-900 truncate" title={item.product.name}>
                      {item.product.name}
                    </span>
                    <span className="text-gray-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-900 whitespace-nowrap">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <Divider className="my-4" />
            
            <div className="flex justify-between items-center mb-2">
              <Text className="text-gray-600">Subtotal ({totalItems} items)</Text>
              <Text className="font-medium">{formatCurrency(totalPrice)}</Text>
            </div>
            <div className="flex justify-between items-center mb-6">
              <Text className="text-gray-600">Shipping</Text>
              <Text className="font-medium text-green-600">Free</Text>
            </div>
            
            <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Text className="text-gray-800 font-semibold text-lg">Total Amount</Text>
              <Title level={3} className="mb-0! text-indigo-600">{formatCurrency(totalPrice)}</Title>
            </div>
            
            <Button
              type="primary"
              size="large"
              className="w-full h-14 text-lg font-medium shadow-md transition-all hover:-translate-y-0.5"
              loading={loading}
              onClick={() => form.submit()}
            >
              {loading ? 'Processing...' : 'Place Order Now'}
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
              By placing your order, you agree to our Terms of Service and Privacy Policy. All transactions are secure and encrypted.
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
