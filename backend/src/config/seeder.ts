import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('Seeding database with default categories and products...');

    // Clear existing to avoid duplicate slug/name issues and sync mock catalog
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Seed categories
    const electronics = await Category.create({ name: 'Electronics', slug: 'electronics' });
    const wearables = await Category.create({ name: 'Wearables', slug: 'wearables' });
    const audio = await Category.create({ name: 'Audio', slug: 'audio' });
    const accessories = await Category.create({ name: 'Accessories', slug: 'accessories' });

    // Seed products
    const productsData = [
      {
        name: 'Ultra Wireless Headphones',
        description: 'Experience studio-quality sound with adaptive active noise cancellation and 40-hour battery life.',
        price: 4999.00,
        stock: 50,
        category: audio._id,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Quantum Smart Watch',
        description: 'Stay active with real-time health analytics, high-accuracy GPS tracker, and sleek amoled design.',
        price: 8999.00,
        stock: 30,
        category: wearables._id,
        images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Mechanical Keyboard',
        description: 'Tactile mechanical keyboard with customized RGB backlighting and hot-swappable key switches.',
        price: 3499.00,
        stock: 40,
        category: accessories._id,
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Ergonomic Mouse',
        description: 'Designed for comfort, with a vertical posture angle, wireless connectivity, and silent clicks.',
        price: 1999.00,
        stock: 60,
        category: accessories._id,
        images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Waterproof outdoor Bluetooth speaker delivering rich deep bass and 15W high-fidelity audio.',
        price: 2999.00,
        stock: 25,
        category: audio._id,
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Active Noise Buds',
        description: 'Ultra-lightweight wireless earbuds with touch gestures, water resistance, and crystal-clear voice calls.',
        price: 5999.00,
        stock: 45,
        category: audio._id,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Curved Gaming Monitor',
        description: 'Immersive 27-inch 144Hz curved display with ultra-fast 1ms response time and HDR support.',
        price: 18999.00,
        stock: 15,
        category: electronics._id,
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Premium Wireless Soundbar',
        description: 'Sleek 2.1 channel soundbar with wireless subwoofer, Bluetooth connectivity, and Dolby Digital virtual surround sound.',
        price: 12999.00,
        stock: 20,
        category: audio._id,
        images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Audiophile Wired Headphones',
        description: 'Open-back reference headphones designed for mixing and mastering, featuring lightweight aluminum voice coils.',
        price: 15999.00,
        stock: 10,
        category: audio._id,
        images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Pro 4K Action Camera',
        description: 'Capture high-octane moments in stunning 4K at 60fps, featuring state-of-the-art optical stabilization and waterproof chassis.',
        price: 24999.00,
        stock: 12,
        category: electronics._id,
        images: ['https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Dual-Band Mesh Wi-Fi Router',
        description: 'Eliminate dead zones with high-performance mesh coverage up to 3000 sq ft, supporting 50+ concurrent devices.',
        price: 7999.00,
        stock: 25,
        category: electronics._id,
        images: ['https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Fitness Tracking Smart Ring',
        description: 'Ultra-compact smart ring tracking sleep stages, active heart rate, and body temperature with 7-day battery life.',
        price: 14999.00,
        stock: 18,
        category: wearables._id,
        images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Hybrid Smart Analog Watch',
        description: 'Timeless analog watch face combined with a hidden monochrome smart display for notifications and activity metrics.',
        price: 11999.00,
        stock: 15,
        category: wearables._id,
        images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Minimalist Leather Wallet',
        description: 'Full-grain slim leather wallet with RFID blocking technology and a fast-access card ejection switch.',
        price: 2499.00,
        stock: 100,
        category: accessories._id,
        images: ['https://images.unsplash.com/photo-1627124118303-622c97398867?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Premium Desk Mat',
        description: 'Eco-friendly felt wool desk pad providing smooth mouse gliding, keyboard stabilization, and scratch protection.',
        price: 1499.00,
        stock: 75,
        category: accessories._id,
        images: ['https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: '4K Smart Projector',
        description: 'Ultra short throw smart laser projector delivering 150 inches of crystal-clear 4K screen, with built-in theater speaker system.',
        price: 35999.00,
        stock: 8,
        category: electronics._id,
        images: ['https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Premium Noise-Cancelling Microphone',
        description: 'Professional condenser USB microphone with customizable polar patterns and integrated studio-grade shock mount.',
        price: 10999.00,
        stock: 15,
        category: electronics._id,
        images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Smart Sleep Band',
        description: 'Comfortable fabric sleep tracker analyzing deep sleep cycles, resting heart rate, and overnight breathing patterns.',
        price: 6999.00,
        stock: 22,
        category: wearables._id,
        images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
      {
        name: 'Retro Vinyl Turntable',
        description: 'Belt-driven retro record player with built-in stereo speakers, wireless output option, and high-fidelity cartridge.',
        price: 14999.00,
        stock: 10,
        category: audio._id,
        images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80'],
        isActive: true,
      },
    ];

    await Product.create(productsData);
    console.log('Database seeded successfully with 4 categories and 19 products!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
