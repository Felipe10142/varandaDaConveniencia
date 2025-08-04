import { useState, useEffect } from 'react';
import apiService from '../services/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  isAvailable: boolean;
  rating: number;
  numReviews: number;
  discount?: {
    percentage: number;
    validUntil: Date;
  };
  nutritionalInfo?: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    ingredients: string[];
    allergens: string[];
  };
  preparation?: {
    time: number;
    instructions: string[];
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProducts();
      setProducts(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos');
      // Fallback to mock data if API is not available
      setProducts([
        {
          _id: "1",
          name: "Frango Assado Completo",
          description: "Frango inteiro assado com temperos especiais, acompanha batatas.",
          price: 45.9,
          category: "Frangos",
          images: ["/image.png"],
          stock: 10,
          isAvailable: true,
          rating: 4.5,
          numReviews: 12,
          tags: ["frango", "assado", "completo"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "2",
          name: "Marmita Tradicional",
          description: "Arroz, feijão, filé de frango grelhado, salada e farofa.",
          price: 22.9,
          category: "Marmitas",
          images: ["/image.png"],
          stock: 20,
          isAvailable: true,
          rating: 4.2,
          numReviews: 8,
          tags: ["marmita", "tradicional"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "3",
          name: "Marmita Executiva",
          description: "Arroz, feijão, bife acebolado, purê de batatas e legumes.",
          price: 27.9,
          category: "Marmitas",
          images: ["/image.png"],
          stock: 15,
          isAvailable: true,
          rating: 4.7,
          numReviews: 15,
          tags: ["marmita", "executiva"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "4",
          name: "Refrigerante 2L",
          description: "Refrigerante gelado, diversas marcas disponíveis.",
          price: 12.9,
          category: "Bebidas",
          images: ["/image.png"],
          stock: 50,
          isAvailable: true,
          rating: 4.0,
          numReviews: 5,
          tags: ["bebida", "refrigerante"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "5",
          name: "Água Mineral 500ml",
          description: "Água mineral sem gás, garrafa individual.",
          price: 3.5,
          category: "Bebidas",
          images: ["/image.png"],
          stock: 100,
          isAvailable: true,
          rating: 4.8,
          numReviews: 25,
          tags: ["bebida", "água"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "6",
          name: "Frango Assado Meio",
          description: "Meio frango assado com temperos especiais.",
          price: 25.9,
          category: "Frangos",
          images: ["/image.png"],
          stock: 8,
          isAvailable: true,
          rating: 4.3,
          numReviews: 10,
          tags: ["frango", "assado", "meio"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "7",
          name: "Cerveja Long Neck",
          description: "Cerveja gelada, diversas marcas disponíveis.",
          price: 8.9,
          category: "Bebidas",
          images: ["/image.png"],
          stock: 80,
          isAvailable: true,
          rating: 4.1,
          numReviews: 18,
          tags: ["bebida", "cerveja"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "8",
          name: "Marmita Vegetariana",
          description: "Arroz, feijão, legumes grelhados, salada e proteína vegetal.",
          price: 24.9,
          category: "Marmitas",
          images: ["/image.png"],
          stock: 12,
          isAvailable: true,
          rating: 4.6,
          numReviews: 7,
          tags: ["marmita", "vegetariana"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductById = (id: string) => {
    return products.find(product => product._id === id);
  };

  const getProductsByCategory = (category: string) => {
    if (category === "Todos") return products;
    return products.filter(product => product.category === category);
  };

  const refreshProducts = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    getProductById,
    getProductsByCategory,
    refreshProducts,
  };
}; 