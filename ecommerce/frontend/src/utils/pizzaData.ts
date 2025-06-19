import { PizzaSize } from "../contexts/CartContext";

export type Pizza = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  prices: Record<PizzaSize, number>;
  category: 'classic' | 'specialty' | 'vegetarian';
  toppings: string[];
  isPopular?: boolean;
};

export const pizzas: Pizza[] = [
  {
    id: "1",
    name: "Pepperoni",
    description: "Classic pepperoni pizza with mozzarella cheese and our signature tomato sauce",
    imageUrl: "https://images.pexels.com/photos/2714722/pexels-photo-2714722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 9.99,
      medium: 12.99,
      large: 15.99
    },
    category: "classic",
    toppings: ["pepperoni", "mozzarella", "tomato sauce"],
    isPopular: true
  },
  {
    id: "2",
    name: "Margherita",
    description: "Traditional margherita with fresh basil, mozzarella, and tomato sauce",
    imageUrl: "https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 8.99,
      medium: 10.99,
      large: 13.99
    },
    category: "classic",
    toppings: ["fresh basil", "mozzarella", "tomato sauce"],
    isPopular: true
  },
  {
    id: "3",
    name: "Supreme",
    description: "Loaded with pepperoni, sausage, bell peppers, onions, and black olives",
    imageUrl: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 11.99,
      medium: 14.99,
      large: 17.99
    },
    category: "specialty",
    toppings: ["pepperoni", "sausage", "bell peppers", "onions", "black olives", "mozzarella", "tomato sauce"],
    isPopular: true
  },
  {
    id: "4",
    name: "BBQ Chicken",
    description: "Grilled chicken, red onions, and BBQ sauce with a blend of cheeses",
    imageUrl: "https://images.pexels.com/photos/845798/pexels-photo-845798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 10.99,
      medium: 13.99,
      large: 16.99
    },
    category: "specialty",
    toppings: ["grilled chicken", "red onions", "BBQ sauce", "cheddar", "mozzarella"],
    isPopular: true
  },
  {
    id: "5",
    name: "Veggie Delight",
    description: "Fresh bell peppers, mushrooms, onions, tomatoes, and black olives",
    imageUrl: "https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 9.99,
      medium: 12.99,
      large: 15.99
    },
    category: "vegetarian",
    toppings: ["bell peppers", "mushrooms", "onions", "tomatoes", "black olives", "mozzarella", "tomato sauce"]
  },
  {
    id: "6",
    name: "Meat Lovers",
    description: "For the carnivores: pepperoni, sausage, bacon, ham, and ground beef",
    imageUrl: "https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 12.99,
      medium: 15.99,
      large: 18.99
    },
    category: "specialty",
    toppings: ["pepperoni", "sausage", "bacon", "ham", "ground beef", "mozzarella", "tomato sauce"]
  },
  {
    id: "7",
    name: "Hawaiian",
    description: "The controversial favorite with ham, pineapple, and mozzarella",
    imageUrl: "https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 9.99,
      medium: 12.99,
      large: 15.99
    },
    category: "specialty",
    toppings: ["ham", "pineapple", "mozzarella", "tomato sauce"]
  },
  {
    id: "8",
    name: "Buffalo Chicken",
    description: "Spicy buffalo chicken with ranch dressing and mozzarella",
    imageUrl: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 10.99,
      medium: 13.99,
      large: 16.99
    },
    category: "specialty",
    toppings: ["buffalo chicken", "ranch dressing", "mozzarella"]
  },
  {
    id: "9",
    name: "Spinach & Feta",
    description: "Fresh spinach, feta cheese, and garlic on a white sauce base",
    imageUrl: "https://images.pexels.com/photos/6941010/pexels-photo-6941010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 9.99,
      medium: 12.99,
      large: 15.99
    },
    category: "vegetarian",
    toppings: ["spinach", "feta cheese", "garlic", "white sauce"]
  },
  {
    id: "10",
    name: "Mushroom & Truffle",
    description: "Assorted mushrooms with truffle oil and mozzarella on a white sauce base",
    imageUrl: "https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prices: {
      small: 11.99,
      medium: 14.99,
      large: 17.99
    },
    category: "vegetarian",
    toppings: ["mushrooms", "truffle oil", "mozzarella", "white sauce"]
  }
];