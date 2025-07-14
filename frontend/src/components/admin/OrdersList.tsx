import React, { useState } from 'react';
import { CheckIcon, XIcon, EyeIcon } from 'lucide-react';
type OrderStatus = 'pending' | 'preparing' | 'delivery' | 'completed' | 'cancelled';
type Order = {
  id: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  date: Date;
};
// Mock orders data
const mockOrders: Order[] = [{
  id: 'ORD-001',
  customer: {
    name: 'João Silva',
    address: 'Rua das Flores, 123',
    phone: '(48) 99999-1111'
  },
  items: [{
    name: 'Frango Assado Completo',
    quantity: 1,
    price: 45.9
  }, {
    name: 'Refrigerante 2L',
    quantity: 1,
    price: 12.9
  }],
  total: 58.8,
  status: 'pending',
  date: new Date(2023, 6, 15, 19, 30)
}, {
  id: 'ORD-002',
  customer: {
    name: 'Maria Oliveira',
    address: 'Av. Beira Mar, 456',
    phone: '(48) 99999-2222'
  },
  items: [{
    name: 'Marmita Tradicional',
    quantity: 2,
    price: 22.9
  }],
  total: 45.8,
  status: 'preparing',
  date: new Date(2023, 6, 15, 18, 45)
}, {
  id: 'ORD-003',
  customer: {
    name: 'Pedro Santos',
    address: 'Rua dos Coqueiros, 789',
    phone: '(48) 99999-3333'
  },
  items: [{
    name: 'Marmita Executiva',
    quantity: 1,
    price: 27.9
  }, {
    name: 'Água Mineral 500ml',
    quantity: 1,
    price: 3.5
  }],
  total: 31.4,
  status: 'delivery',
  date: new Date(2023, 6, 15, 18, 15)
}, {
  id: 'ORD-004',
  customer: {
    name: 'Ana Costa',
    address: 'Rua das Gaivotas, 321',
    phone: '(48) 99999-4444'
  },
  items: [{
    name: 'Frango Assado Meio',
    quantity: 1,
    price: 25.9
  }, {
    name: 'Cerveja Long Neck',
    quantity: 2,
    price: 8.9
  }],
  total: 43.7,
  status: 'completed',
  date: new Date(2023, 6, 15, 17, 30)
}, {
  id: 'ORD-005',
  customer: {
    name: 'Carlos Mendes',
    address: 'Rua do Sol, 567',
    phone: '(48) 99999-5555'
  },
  items: [{
    name: 'Marmita Vegetariana',
    quantity: 1,
    price: 24.9
  }],
  total: 24.9,
  status: 'cancelled',
  date: new Date(2023, 6, 15, 17, 0)
}];
const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? {
      ...order,
      status: newStatus
    } : order));
  };
  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivery':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'preparing':
        return 'Em Preparo';
      case 'delivery':
        return 'Em Entrega';
      case 'completed':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-xl font-bold p-6 border-b">Pedidos Recentes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-dark">
                    {order.id}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-dark">{order.customer.name}</div>
                  <div className="text-sm text-gray truncate max-w-xs">
                    {order.customer.address}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray">
                    {formatDate(order.date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-dark">
                    R$ {order.total.toFixed(2).replace('.', ',')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => openOrderDetails(order)} className="text-gray hover:text-primary transition-colors" title="Ver detalhes">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {order.status !== 'completed' && order.status !== 'cancelled' && <button onClick={() => handleStatusChange(order.id, 'completed')} className="text-gray hover:text-success transition-colors" title="Marcar como entregue">
                          <CheckIcon className="w-5 h-5" />
                        </button>}
                    {order.status !== 'cancelled' && order.status !== 'completed' && <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="text-gray hover:text-error transition-colors" title="Cancelar pedido">
                          <XIcon className="w-5 h-5" />
                        </button>}
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
          <div className="relative p-8 bg-white w-full max-w-md m-auto rounded-lg">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setIsModalOpen(false)} className="text-gray hover:text-dark">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold mb-4">
              Detalhes do Pedido {selectedOrder.id}
            </h3>
            <div className="mb-4">
              <h4 className="font-medium text-dark">Cliente</h4>
              <p>{selectedOrder.customer.name}</p>
              <p>{selectedOrder.customer.address}</p>
              <p>{selectedOrder.customer.phone}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-dark mb-2">Itens</h4>
              <ul className="border rounded-lg divide-y">
                {selectedOrder.items.map((item, index) => <li key={index} className="p-3 flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>
                      R${' '}
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </li>)}
              </ul>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>R$ {selectedOrder.total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-dark mb-2">Status</h4>
              <select value={selectedOrder.status} onChange={e => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="pending">Pendente</option>
                <option value="preparing">Em Preparo</option>
                <option value="delivery">Em Entrega</option>
                <option value="completed">Entregue</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-dark font-medium py-2 px-4 rounded-lg transition-colors">
                Fechar
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export default OrdersList;