import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import connectDB from './db.js';

dotenv.config();

connectDB();

const categoriesData = [
  {
    name: 'Cyberware',
    description: 'Neural links, ocular implants, and high-performance prosthetics.',
    slug: 'cyberware',
    icon: 'Cpu',
  },
  {
    name: 'Exo-Suits',
    description: 'Power armor and gravity-assist mobility chassis.',
    slug: 'exo-suits',
    icon: 'Shield',
  },
  {
    name: 'Quantum Tech',
    description: 'Pocket-sized qubits processors and sub-atomic power cells.',
    slug: 'quantum-tech',
    icon: 'Zap',
  },
  {
    name: 'Holo-Displays',
    description: 'Volumetric projections, light-field HUDs, and neural optic panels.',
    slug: 'holo-displays',
    icon: 'Layers',
  },
];

const productsData = (categories) => {
  const getCatId = (slug) => categories.find((c) => c.slug === slug)._id;

  return [
    {
      name: 'NeuralLink V4 Core',
      description: 'Upgrade your cognitive processing. Dual-threaded quantum neural synchronization, featuring instant language translation and reflex acceleration subroutines. Installs via non-invasive micro-threads.',
      price: 1299.99,
      images: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=600&auto=format&fit=crop',
      ],
      category: getCatId('cyberware'),
      brand: 'CortexCorp',
      countInStock: 15,
      rating: 4.8,
      numReviews: 2,
      isFeatured: true,
    },
    {
      name: 'Ocular Optix-9 HUD',
      description: 'Replaces standard vision spectrums. Advanced thermographic, night-vision, and digital overlays directly mapping real-time navigation and facial recognition markers directly on your retina.',
      price: 649.99,
      images: [
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
      ],
      category: getCatId('cyberware'),
      brand: 'OptimaEye',
      countInStock: 22,
      rating: 4.5,
      numReviews: 1,
      isFeatured: false,
    },
    {
      name: 'Aegis Sentinel Exo-Suit',
      description: 'Full-body tactical chassis designed for heavy load lifting and atmospheric resistance. Features automated posture correction, battery life of 120 hours, and kinetic impact absorption.',
      price: 4999.99,
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=600&auto=format&fit=crop',
      ],
      category: getCatId('exo-suits'),
      brand: 'HeavyMech',
      countInStock: 5,
      rating: 4.9,
      numReviews: 3,
      isFeatured: true,
    },
    {
      name: 'Apex Light-Frame Exo-Legs',
      description: 'Enhance your speed and agility. Lower limb exoskeleton offering a 400% increase in jump heights and fatigue-free sprinting up to 45km/h. Dynamic carbon-fiber support.',
      price: 2199.99,
      images: [
        'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=600&auto=format&fit=crop',
      ],
      category: getCatId('exo-suits'),
      brand: 'HeavyMech',
      countInStock: 8,
      rating: 4.6,
      numReviews: 1,
      isFeatured: false,
    },
    {
      name: 'Quantum Cell QD-50',
      description: 'Infinite power at sub-atomic scale. Using stable helium isotope qubits, provides self-replenishing electrical output, perfect for charging neural rigs, cyberware, or personal displays.',
      price: 349.99,
      images: [
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop',
      ],
      category: getCatId('quantum-tech'),
      brand: 'SubAtomic',
      countInStock: 50,
      rating: 4.2,
      numReviews: 0,
      isFeatured: false,
    },
    {
      name: 'Volo 3D Hologram Projector',
      description: 'Desktop volumetric display. Casts high-fidelity 4K 3D holograms of dynamic media, files, or telemetry. Features hand-gesture controls and ambient workspace lighting mode.',
      price: 899.99,
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600&auto=format&fit=crop',
      ],
      category: getCatId('holo-displays'),
      brand: 'HoloMedia',
      countInStock: 12,
      rating: 4.7,
      numReviews: 1,
      isFeatured: true,
    },
  ];
};

const importData = async () => {
  try {
    // Delete all current records
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    console.log('Database cleared.');

    // 1. Seed Users
    const users = await User.create([
      {
        name: 'Neo Admin',
        email: 'admin@neocartx.com',
        password: 'admin123',
        isAdmin: true,
        addresses: [
          {
            street: '101 Cyber Plaza',
            city: 'Neo Tokyo',
            state: 'Kanto',
            zipCode: '100-0001',
            country: 'Japan',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Alex Vance',
        email: 'user@neocartx.com',
        password: 'user123',
        isAdmin: false,
        addresses: [
          {
            street: '404 Grid sector',
            city: 'New Denver',
            state: 'Colorado',
            zipCode: '80202',
            country: 'USA',
            isDefault: true,
          },
        ],
      },
    ]);

    const adminUser = users[0];
    const normalUser = users[1];

    // Create carts
    await Cart.create({ user: adminUser._id, items: [] });
    await Cart.create({ user: normalUser._id, items: [] });

    console.log('Users seeded.');

    // 2. Seed Categories
    const categories = await Category.insertMany(categoriesData);
    console.log('Categories seeded.');

    // 3. Seed Products
    const products = await Product.insertMany(productsData(categories));
    console.log('Products seeded.');

    // 4. Seed Reviews
    const reviewData = [
      {
        product: products[0]._id, // NeuralLink
        user: normalUser._id,
        name: normalUser.name,
        rating: 5,
        comment: 'Absolutely game changing! The latency is near-zero and the vocabulary update feature is incredible.',
      },
      {
        product: products[0]._id,
        user: adminUser._id,
        name: adminUser.name,
        rating: 4,
        comment: 'Works exceptionally well, though minor configuration was required during initial neural adaptation.',
      },
      {
        product: products[2]._id, // Exo-Suit
        user: normalUser._id,
        name: normalUser.name,
        rating: 5,
        comment: 'Best exosuit in the market! Lifted a 2-ton reactor core without breaking a sweat.',
      },
    ];

    await Review.insertMany(reviewData);
    console.log('Reviews seeded.');

    console.log('Database Import Complete!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
