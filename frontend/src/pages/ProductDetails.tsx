import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Spin, Tag, Button, message, Typography } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getProductById } from '../services/api';
import { type Product } from '../schemas/product.schema';
import { formatCurrency } from '../utils/formatCurrency';
import { addToCart } from '../utils/cart';

const { Title, Paragraph } = Typography;

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details.');
        message.error('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center">
        <Typography.Text type="danger">{error || 'Product not found.'}</Typography.Text>
        <div className="mt-4">
          <Button onClick={() => navigate('/')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 w-full animate-fade-in max-w-6xl mx-auto">
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')}
        className="mb-6 px-0 text-gray-600 hover:text-gray-900"
      >
        Back to Products
      </Button>

      <Row gutter={[32, 32]} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <Col xs={24} md={10} lg={12}>
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            <span className="text-gray-400 text-lg">Product Image</span>
          </div>
        </Col>
        
        <Col xs={24} md={14} lg={12} className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Tag color="green" className="mb-2">Active</Tag>
          </div>
          
          <Title level={2} className="mb-1!">{product.name}</Title>
          <div className="text-gray-500 mb-6 text-sm">Model: {product.model}</div>
          
          <div className="mb-6">
            <span className="text-4xl font-bold tracking-tight text-gray-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          <Paragraph className="text-gray-600 text-base leading-relaxed mb-8 whitespace-pre-line">
            {product.description}
          </Paragraph>
          
          <div className="mt-auto pt-6 border-t border-gray-100">
            <Button 
              type="primary" 
              size="large" 
              icon={<ShoppingCartOutlined />} 
              onClick={() => addToCart(product)}
              className="w-full md:w-auto px-8 py-2 h-12 text-lg font-medium"
            >
              Add to Cart
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
