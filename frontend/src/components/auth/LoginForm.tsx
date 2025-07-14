import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const {
    login,
    loading,
    error
  } = useAuth();
  const navigate = useNavigate();
  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    }
  };
  return <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-dark">Bem-vindo de volta</h2>
        <p className="text-gray mt-2">Entre com sua conta para continuar</p>
      </div>
      {error && <motion.div className="bg-error bg-opacity-10 text-error p-4 rounded-lg mb-6" initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }}>
          {error}
        </motion.div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray" />
            </div>
            <input type="email" id="email" value={email} onChange={e => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors({
                ...errors,
                email: undefined
              });
            }
          }} className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.email ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="seu@email.com" />
          </div>
          {errors.email && <p className="mt-1 text-error text-sm">{errors.email}</p>}
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-gray font-medium">
              Senha
            </label>
            <a href="#" className="text-sm text-primary hover:text-secondary">
              Esqueceu a senha?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray" />
            </div>
            <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={e => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors({
                ...errors,
                password: undefined
              });
            }
          }} className={`w-full pl-10 pr-10 py-3 rounded-lg border ${errors.password ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="••••••••" />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray" /> : <EyeIcon className="h-5 w-5 text-gray" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-error text-sm">{errors.password}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
          {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg> : 'Entrar'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-gray">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:text-secondary font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>;
};
export default LoginForm;