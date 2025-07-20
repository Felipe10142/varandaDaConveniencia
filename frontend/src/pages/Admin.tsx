import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ShoppingBagIcon,
  PackageIcon,
  UsersIcon,
  HomeIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import ProductForm from "../components/admin/ProductForm";
import OrdersList from "../components/admin/OrdersList";
const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  // Check if the route is active
  const isActive = (path: string) => {
    return (
      location.pathname === `/admin${path}` ||
      (location.pathname === "/admin" && path === "")
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-20 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="bg-white p-2 rounded-md shadow-md text-gray hover:text-primary transition-colors"
        >
          {isSidebarOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 z-20 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out pt-16`}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-dark">Área do Administrador</h2>
          <p className="text-gray text-sm mt-1">Bem-vindo, {user?.name}</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                onClick={closeSidebar}
                className={`flex items-center p-3 rounded-lg transition-colors ${isActive("") ? "bg-primary text-white" : "text-gray hover:bg-gray-100"}`}
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/produtos"
                onClick={closeSidebar}
                className={`flex items-center p-3 rounded-lg transition-colors ${isActive("/produtos") ? "bg-primary text-white" : "text-gray hover:bg-gray-100"}`}
              >
                <PackageIcon className="w-5 h-5 mr-3" />
                <span>Produtos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/pedidos"
                onClick={closeSidebar}
                className={`flex items-center p-3 rounded-lg transition-colors ${isActive("/pedidos") ? "bg-primary text-white" : "text-gray hover:bg-gray-100"}`}
              >
                <ShoppingBagIcon className="w-5 h-5 mr-3" />
                <span>Pedidos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/usuarios"
                onClick={closeSidebar}
                className={`flex items-center p-3 rounded-lg transition-colors ${isActive("/usuarios") ? "bg-primary text-white" : "text-gray hover:bg-gray-100"}`}
              >
                <UsersIcon className="w-5 h-5 mr-3" />
                <span>Usuários</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <div className="md:ml-64 p-6">
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/produtos" element={<AdminProducts />} />
            <Route path="/pedidos" element={<AdminOrders />} />
            <Route path="/usuarios" element={<AdminUsers />} />
          </Routes>
        </div>
      </div>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
};
const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary bg-opacity-10 text-primary">
              <ShoppingBagIcon className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray text-sm">Pedidos Hoje</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary bg-opacity-10 text-secondary">
              <PackageIcon className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray text-sm">Produtos</h3>
              <p className="text-2xl font-bold">48</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success bg-opacity-10 text-success">
              <UsersIcon className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray text-sm">Usuários</h3>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent bg-opacity-10 text-accent">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray text-sm">Vendas Hoje</h3>
              <p className="text-2xl font-bold">R$ 1.250,00</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <OrdersList />
      </div>
    </div>
  );
};
const AdminProducts: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gerenciar Produtos</h1>
      <ProductForm />
    </div>
  );
};
const AdminOrders: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gerenciar Pedidos</h1>
      <OrdersList />
    </div>
  );
};
const AdminUsers: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray">Funcionalidade em desenvolvimento.</p>
      </div>
    </div>
  );
};
export default AdminPage;
