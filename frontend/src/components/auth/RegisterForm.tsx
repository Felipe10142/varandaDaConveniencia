import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const {
    register,
    loading,
    error
  } = useAuth();
  const navigate = useNavigate();
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        navigate('/');
      }
    }
  };
  return <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-dark">Crie sua conta</h2>
        <p className="text-gray mt-2">Cadastre-se para fazer pedidos online</p>
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
          <label htmlFor="name" className="block text-gray font-medium mb-2">
            Nome completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray" />
            </div>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.name ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="Seu nome completo" />
          </div>
          {errors.name && <p className="mt-1 text-error text-sm">{errors.name}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray" />
            </div>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full pl-10 pr-3 py-3 rounded-lg border ${errors.email ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="seu@email.com" />
          </div>
          {errors.email && <p className="mt-1 text-error text-sm">{errors.email}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray font-medium mb-2">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray" />
            </div>
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className={`w-full pl-10 pr-10 py-3 rounded-lg border ${errors.password ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="Mínimo 6 caracteres" />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray" /> : <EyeIcon className="h-5 w-5 text-gray" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-error text-sm">{errors.password}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray font-medium mb-2">
            Confirmar senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray" />
            </div>
            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full pl-10 pr-10 py-3 rounded-lg border ${errors.confirmPassword ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="Confirme sua senha" />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray" /> : <EyeIcon className="h-5 w-5 text-gray" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-error text-sm">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
          {loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg> : 'Cadastrar'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-gray">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:text-secondary font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </div>;
};
export default RegisterForm;