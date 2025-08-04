import React, { useState, useEffect } from "react";
import { PlusIcon, ImageIcon, UploadCloudIcon } from "lucide-react";
import apiService, { Product } from "../../services/api";

type FormData = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
};

type FormErrors = {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  images?: string;
};

interface ProductFormProps {
  productToEdit?: Product | null;
  onSuccess: () => void;
}

const categories = ["Bebidas", "Snacks", "Comidas", "Postres", "Panadería", "Otros"];

const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    images: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        category: productToEdit.category,
        stock: productToEdit.stock,
        images: productToEdit.images,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        images: [],
      });
    }
  }, [productToEdit]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nome do produto é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (formData.price <= 0) newErrors.price = "Preço deve ser maior que zero";
    if (!formData.category) newErrors.category = "Categoria é obrigatória";
    if (formData.stock < 0) newErrors.stock = "Estoque não pode ser negativo";
    if (formData.images.length === 0 && imageFiles.length === 0) newErrors.images = "Pelo menos uma imagem é obrigatória";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const imageUrls = [...formData.images];
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => apiService.uploadImage(file));
        const uploadResults = await Promise.all(uploadPromises);
        imageUrls.push(...uploadResults.map(res => res.data.url));
      }

      const productData = { ...formData, images: imageUrls };

      if (productToEdit) {
        await apiService.updateProduct(productToEdit._id, productData);
      } else {
        await apiService.createProduct(productData);
      }

      onSuccess();
    } catch (err) {
      console.error("Falha ao salvar produto:", err);
      alert("Ocorreu um erro ao salvar o produto.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">
        {productToEdit ? "Editar Produto" : "Adicionar Novo Produto"}
      </h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${errors.price ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.price && <p className="mt-1 text-red-500 text-sm">{errors.price}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${errors.category ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-red-500 text-sm">{errors.category}</p>}
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Estoque
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${errors.stock ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.stock && <p className="mt-1 text-red-500 text-sm">{errors.stock}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${errors.description ? "border-red-500" : "border-gray-300"}`}
            ></textarea>
            {errors.description && <p className="mt-1 text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagens</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                  >
                    <span>Carregar arquivos</span>
                    <input id="file-upload" name="images" type="file" multiple onChange={handleImageChange} className="sr-only" />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
              </div>
            </div>
            {errors.images && <p className="mt-1 text-red-500 text-sm">{errors.images}</p>}
            {/* Image Previews */}
            <div className="mt-4 flex flex-wrap gap-4">
              {formData.images.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={img} alt="Preview" className="w-full h-full object-cover rounded-md" />
                </div>
              ))}
              {imageFiles.map((file, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : (productToEdit ? "Salvar Alterações" : "Adicionar Produto")}
          </button>
        </div>
      </form>
    </div>
  );
};
export default ProductForm;
