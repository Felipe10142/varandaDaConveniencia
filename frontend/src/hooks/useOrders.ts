
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    product: {
      _id: string;
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
    price: number;
    name: string;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: 'pending' | 'preparing' | 'delivery' | 'completed' | 'cancelled';
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.getOrders();
        setOrders(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
};
