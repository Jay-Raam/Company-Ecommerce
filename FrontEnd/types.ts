export interface Product {
  tax: number;
  rate: any;
  stockAvailabilityInformation: any;
  priceInformation: any;
  size: any;
  brand: string;
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  description: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Lumina Air max',
    price: 199,
    category: 'Audio',
    image: 'https://picsum.photos/id/1/800/800',
    rating: 4.8,
    description: 'Experience sound like never before with active noise cancellation and spatial audio.',
    isNew: true
  },
  {
    id: '2',
    name: 'Chronos Watch X',
    price: 350,
    category: 'Wearables',
    image: 'https://picsum.photos/id/2/800/800',
    rating: 4.9,
    description: 'A timepiece that blends classic elegance with modern health tracking capabilities.'
  },
  {
    id: '3',
    name: 'Vortex Running Shoe',
    price: 120,
    category: 'Footwear',
    image: 'https://picsum.photos/id/3/800/800',
    rating: 4.5,
    description: 'Engineered for speed, designed for comfort. The ultimate running companion.',
    isNew: true
  },
  {
    id: '4',
    name: 'Essence Minimalist Chair',
    price: 450,
    category: 'Home',
    image: 'https://picsum.photos/id/4/800/800',
    rating: 4.7,
    description: 'Ergonomic design meets scandinavian minimalism. Perfect for the modern workspace.'
  },
  {
    id: '5',
    name: 'Spectra Glass',
    price: 299,
    category: 'Accessories',
    image: 'https://picsum.photos/id/5/800/800',
    rating: 4.6,
    description: 'Augmented reality smart glasses that look just like regular eyewear.'
  },
  {
    id: '6',
    name: 'Nebula Backpack',
    price: 89,
    category: 'Accessories',
    image: 'https://picsum.photos/id/6/800/800',
    rating: 4.8,
    description: 'Waterproof, durable, and surprisingly lightweight. Your daily commute redefined.'
  }
];

export const CATEGORIES = ['All', 'Audio', 'Wearables', 'Footwear', 'Home', 'Accessories'];
