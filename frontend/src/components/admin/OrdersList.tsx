import React, { useState, useEffect } from "react";
import { CheckIcon, XIcon, EyeIcon } from "lucide-react";
import apiService, { Order } from "../../services/api";
import { useSocket } from "../../contexts/SocketContext";

type OrderStatus =
  | "pending"
  | "processing"
  | "completed";

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.getOrders();
        setOrders(response.data);
      } catch (err) {
        setError("Falha ao carregar pedidos.");
        console.error(err);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("orderPaid", (newOrder: Order) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    });

    return () => {
      socket.off("orderPaid");
    };
  }, [socket]);
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    // Por ahora, solo manejamos la actualización a "completed"
    if (newStatus !== "completed") return;

    try {
      await apiService.updateOrderToDelivered(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
                isDelivered: true,
              }
            : order,
        ),
      );
    } catch (err) {
      console.error("Falha ao atualizar status do pedido:", err);
      alert("Não foi possível atualizar o status do pedido.");
    }
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "processing":
        return "Em Preparo";
      case "completed":
        return "Entregue";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-6">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-xl font-bold p-6 border-b">Pedidos Recentes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pedido ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cliente
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Data
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order._id.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.user.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    R$ {order.totalPrice.toFixed(2).replace(".", ",")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Ver detalhes"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {order.status !== "completed" &&
                      order.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "completed")
                          }
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          title="Marcar como entregue"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                      )}
                    {order.status !== "cancelled" &&
                      order.status !== "completed" && (
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "cancelled")
                          }
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Cancelar pedido"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
          <div className="relative p-8 bg-white w-full max-w-md m-auto rounded-lg">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-800"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold mb-4">
              Detalhes do Pedido #{selectedOrder._id.substring(0, 8)}...
            </h3>
            <div className="mb-4">
              <h4 className="font-medium text-gray-800">Cliente</h4>
              <p>{selectedOrder.user.name}</p>
              <p>{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}</p>
              <p>{selectedOrder.user.email}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Itens</h4>
              <ul className="border rounded-lg divide-y">
                {selectedOrder.items.map((item, index) => (
                  <li key={index} className="p-3 flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>
                      R${" "}
                      {(item.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>R$ {selectedOrder.totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Status</h4>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(
                    selectedOrder._id,
                    e.target.value as OrderStatus,
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="pending">Pendente</option>
                <option value="processing">Em Preparo</option>
                <option value="completed">Entregue</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrdersList;
