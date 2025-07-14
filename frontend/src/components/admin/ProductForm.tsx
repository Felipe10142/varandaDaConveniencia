import React, { useState } from 'react';
import { PlusIcon, ImageIcon } from 'lucide-react';
type FormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
};
type FormErrors = {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  image?: string;
};
const categories = ['Frangos', 'Marmitas', 'Bebidas'];
const ProductForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(parseFloat(formData.price.replace(',', '.')))) {
      newErrors.price = 'Preço inválido';
    }
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Imagem é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        // Reset form after 2 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            image: ''
          });
        }, 2000);
      }, 1500);
    }
  };
  return <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Adicionar Novo Produto</h3>
      {isSubmitted && <div className="bg-success bg-opacity-10 text-success p-4 rounded-lg mb-6">
          Produto adicionado com sucesso!
        </div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray font-medium mb-2">
              Nome do Produto
            </label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="Ex: Frango Assado Completo" />
            {errors.name && <p className="mt-1 text-error text-sm">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="price" className="block text-gray font-medium mb-2">
              Preço (R$)
            </label>
            <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.price ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="Ex: 45,90" />
            {errors.price && <p className="mt-1 text-error text-sm">{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="category" className="block text-gray font-medium mb-2">
              Categoria
            </label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${errors.category ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}>
              <option value="">Selecione uma categoria</option>
              {categories.map(category => <option key={category} value={category}>
                  {category}
                </option>)}
            </select>
            {errors.category && <p className="mt-1 text-error text-sm">{errors.category}</p>}
          </div>
          <div>
            <label htmlFor="image" className="block text-gray font-medium mb-2">
              URL da Imagem
            </label>
            <div className="flex">
              <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} className={`w-full px-4 py-2 rounded-l-lg border ${errors.image ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="src/assets/images/produtos/..." />
              <button type="button" className="bg-gray-200 hover:bg-gray-300 px-4 rounded-r-lg flex items-center">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
            {errors.image && <p className="mt-1 text-error text-sm">{errors.image}</p>}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-gray font-medium mb-2">
              Descrição
            </label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className={`w-full px-4 py-2 rounded-lg border ${errors.description ? 'border-error' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`} placeholder="Descreva o produto..."></textarea>
            {errors.description && <p className="mt-1 text-error text-sm">{errors.description}</p>}
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-secondary text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center">
            {isSubmitting ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg> : <>
                <PlusIcon className="w-5 h-5 mr-2" />
                Adicionar Produto
              </>}
          </button>
        </div>
      </form>
    </div>;
};
export default ProductForm;