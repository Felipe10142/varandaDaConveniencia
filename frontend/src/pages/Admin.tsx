import React, { useState } from 'react';
import OrdersList from '../components/admin/OrdersList';
import ProductList from '../components/admin/ProductList';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`${activeTab === 'orders'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`${activeTab === 'products'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Produtos
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'orders' && <OrdersList />}
        {activeTab === 'products' && <ProductList />}
      </div>
    </div>
  );
};

export default Admin;
