import { Product } from "../models/Product";

export const seedProducts = [
  {
    name: "Frango Assado Completo",
    description: "Frango inteiro assado com temperos especiais, acompanha batatas.",
    price: 45.9,
    category: "Comidas",
    images: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/chicken.jpg"],
    stock: 10,
    isAvailable: true,
    rating: 4.5,
    numReviews: 12,
    tags: ["frango", "assado", "completo"],
    nutritionalInfo: {
      calories: 650,
      proteins: 45,
      carbs: 25,
      fats: 35,
      ingredients: ["Frango", "Temperos", "Batatas", "Azeite"],
      allergens: ["Nenhum"],
    },
    preparation: {
      time: 45,
      instructions: [
        "Temperar o frango",
        "Assar por 45 minutos",
        "Servir com batatas",
      ],
    },
  },
  {
    name: "Marmita Tradicional",
    description: "Arroz, feijão, filé de frango grelhado, salada e farofa.",
    price: 22.9,
    category: "Comidas",
    images: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/meal.jpg"],
    stock: 20,
    isAvailable: true,
    rating: 4.2,
    numReviews: 8,
    tags: ["marmita", "tradicional"],
    nutritionalInfo: {
      calories: 450,
      proteins: 25,
      carbs: 60,
      fats: 15,
      ingredients: ["Arroz", "Feijão", "Frango", "Salada", "Farofa"],
      allergens: ["Nenhum"],
    },
    preparation: {
      time: 30,
      instructions: [
        "Preparar arroz e feijão",
        "Grelhar o frango",
        "Montar a marmita",
      ],
    },
  },
  {
    name: "Refrigerante 2L",
    description: "Refrigerante gelado, diversas marcas disponíveis.",
    price: 12.9,
    category: "Bebidas",
    images: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/drinks.jpg"],
    stock: 50,
    isAvailable: true,
    rating: 4.0,
    numReviews: 5,
    tags: ["bebida", "refrigerante"],
    nutritionalInfo: {
      calories: 200,
      proteins: 0,
      carbs: 50,
      fats: 0,
      ingredients: ["Água", "Açúcar", "Corantes", "Aromatizantes"],
      allergens: ["Nenhum"],
    },
  },
  {
    name: "Água Mineral 500ml",
    description: "Água mineral sem gás, garrafa individual.",
    price: 3.5,
    category: "Bebidas",
    images: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/water.jpg"],
    stock: 100,
    isAvailable: true,
    rating: 4.8,
    numReviews: 25,
    tags: ["bebida", "água"],
    nutritionalInfo: {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      ingredients: ["Água Mineral"],
      allergens: ["Nenhum"],
    },
  },
  {
    name: "Cerveja Long Neck",
    description: "Cerveja gelada, diversas marcas disponíveis.",
    price: 8.9,
    category: "Bebidas",
    images: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/beer.jpg"],
    stock: 80,
    isAvailable: true,
    rating: 4.1,
    numReviews: 18,
    tags: ["bebida", "cerveja"],
    nutritionalInfo: {
      calories: 150,
      proteins: 1,
      carbs: 12,
      fats: 0,
      ingredients: ["Água", "Malte", "Lúpulo", "Fermento"],
      allergens: ["Glúten"],
    },
  },
  {
    name: "Marmita Vegetariana",
    description: "Arroz, feijão, legumes grelhados, salada e proteína vegetal.",
    price: 24.9,
    category: "Comidas",
    images: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/vegetarian.jpg"],
    stock: 12,
    isAvailable: true,
    rating: 4.6,
    numReviews: 7,
    tags: ["marmita", "vegetariana"],
    nutritionalInfo: {
      calories: 380,
      proteins: 15,
      carbs: 55,
      fats: 12,
      ingredients: ["Arroz", "Feijão", "Legumes", "Proteína Vegetal"],
      allergens: ["Nenhum"],
    },
    preparation: {
      time: 25,
      instructions: [
        "Preparar arroz integral",
        "Grelhar legumes",
        "Montar marmita vegetariana",
      ],
    },
  },
  {
    name: "Pão de Queijo",
    description: "Pão de queijo fresquinho, feito na hora.",
    price: 2.5,
    category: "Snacks",
    images: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/bread.jpg"],
    stock: 30,
    isAvailable: true,
    rating: 4.7,
    numReviews: 15,
    tags: ["pão", "queijo", "snack"],
    nutritionalInfo: {
      calories: 120,
      proteins: 4,
      carbs: 15,
      fats: 6,
      ingredients: ["Polvilho", "Queijo", "Ovos", "Leite"],
      allergens: ["Glúten", "Lactose"],
    },
    preparation: {
      time: 15,
      instructions: [
        "Misturar ingredientes",
        "Formar bolinhas",
        "Assar por 15 minutos",
      ],
    },
  },
  {
    name: "Brigadeiro",
    description: "Brigadeiro caseiro, feito com chocolate belga.",
    price: 4.5,
    category: "Postres",
    images: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/chocolate.jpg"],
    stock: 25,
    isAvailable: true,
    rating: 4.9,
    numReviews: 20,
    tags: ["doce", "chocolate", "brigadeiro"],
    nutritionalInfo: {
      calories: 180,
      proteins: 2,
      carbs: 25,
      fats: 8,
      ingredients: ["Chocolate", "Leite Condensado", "Manteiga", "Chocolate Granulado"],
      allergens: ["Lactose"],
    },
    preparation: {
      time: 20,
      instructions: [
        "Derreter chocolate",
        "Misturar ingredientes",
        "Formar brigadeiros",
      ],
    },
  },
];

export const seedDatabase = async () => {
  try {
    // Limpiar productos existentes
    await Product.deleteMany({});
    
    // Insertar productos de ejemplo
    const createdProducts = await Product.insertMany(seedProducts);
    
    console.log(`✅ ${createdProducts.length} productos insertados exitosamente`);
    return createdProducts;
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
    throw error;
  }
}; 