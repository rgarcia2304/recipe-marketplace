import { Recipe } from './cart';

export const recipes: Recipe[] = [
  // Tacos & Antojitos
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Tacos al Pastor",
    description: "Marinated pork with pineapple, achiote, and chiles. The classic taqueria staple with secrets passed down through generations.",
    price: 9.99,
    category: "Tacos & Antojitos",
    emoji: "🌮",
    difficulty: "Intermediate",
    time: "3 hrs"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Gorditas de Chicharrón",
    description: "Thick masa pockets filled with crispy pork rinds in salsa verde. Street food at its most satisfying.",
    price: 7.99,
    category: "Tacos & Antojitos",
    emoji: "🫓",
    difficulty: "Easy",
    time: "45 min"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Tlayudas Oaxaqueñas",
    description: "Giant crispy tortilla with black beans, Oaxacan cheese, and tasajo. The pizza of Mexico.",
    price: 11.99,
    category: "Tacos & Antojitos",
    emoji: "🫔",
    difficulty: "Intermediate",
    time: "1.5 hrs"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Sopes de Tinga",
    description: "Thick masa bases topped with chipotle chicken, crema, and queso fresco. A beloved antojito for any occasion.",
    price: 8.99,
    category: "Tacos & Antojitos",
    emoji: "🥘",
    difficulty: "Easy",
    time: "1 hr"
  },

  // Moles & Salsas
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Mole Negro Oaxaqueño",
    description: "Deep black mole with 30+ ingredients — mulato chiles, chocolate, spices, charred onion. A sacred recipe.",
    price: 19.99,
    category: "Moles & Salsas",
    emoji: "🫕",
    difficulty: "Advanced",
    time: "2 days"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Salsa Macha",
    description: "Dried chile oil with peanuts, sesame, and garlic. Adds depth to everything it touches.",
    price: 6.99,
    category: "Moles & Salsas",
    emoji: "🌶️",
    difficulty: "Easy",
    time: "20 min"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Mole Amarillo",
    description: "Golden Oaxacan mole with guajillo and costeño chiles, tomatillos, and masa. Lighter than negro but deeply complex.",
    price: 14.99,
    category: "Moles & Salsas",
    emoji: "🍲",
    difficulty: "Advanced",
    time: "4 hrs"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Salsa de Chile de Árbol",
    description: "Fire-roasted tomatillo salsa with chile de árbol. The one that keeps you coming back for more.",
    price: 5.99,
    category: "Moles & Salsas",
    emoji: "🥫",
    difficulty: "Easy",
    time: "30 min"
  },

  // Aguas & Drinks
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "Agua de Jamaica",
    description: "Hibiscus flower agua fresca with a hint of cinnamon. Vibrant crimson, refreshingly tart, impossibly beautiful.",
    price: 4.99,
    category: "Aguas & Drinks",
    emoji: "🌺",
    difficulty: "Easy",
    time: "15 min"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "Tepache de Piña",
    description: "Fermented pineapple drink with piloncillo and spices. Ancient, probiotic, and wildly refreshing.",
    price: 6.99,
    category: "Aguas & Drinks",
    emoji: "🍍",
    difficulty: "Easy",
    time: "3 days"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    name: "Horchata de Arroz",
    description: "Classic rice milk with cinnamon and vanilla. Creamy, cooling, and perfect alongside anything spicy.",
    price: 4.99,
    category: "Aguas & Drinks",
    emoji: "🥛",
    difficulty: "Easy",
    time: "4 hrs"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    name: "Champurrado",
    description: "Thick Mexican hot chocolate with masa, piloncillo, and canela. Winter in a cup.",
    price: 5.99,
    category: "Aguas & Drinks",
    emoji: "☕",
    difficulty: "Easy",
    time: "30 min"
  },
];

export const categories = ["All", "Tacos & Antojitos", "Moles & Salsas", "Aguas & Drinks"];
