import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { login, saveFcmToken } from '../api/auth.api';
import { setUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegisterFcmToken = async (userId: string) => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
        if (token) {
          await saveFcmToken(userId, token);
          console.log('Saved FCM Token automatically on login');
        }
      }
    } catch (e) {
      console.warn("FCM token registration failed:", e);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userData = await login(values.email, values.password);
      setUser(userData);
      message.success('Login successful!');
      
      handleRegisterFcmToken(userData.id);

      onClose();
      form.resetFields();

      if (userData.role === 'ADMIN') {
        navigate('/orders');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Access Your Account"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
    >
      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={onFinish}
        className="mt-6"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your Email!' },
            { type: 'email', message: 'Please enter a valid email address!' }
          ]}
        >
          <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Password" size="large" />
        </Form.Item>

        <Form.Item className="mt-6">
          <Button type="primary" htmlType="submit" className="w-full" size="large" loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
