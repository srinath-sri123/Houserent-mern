const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

dotenv.config();

const usersData = [
  {
    name: 'Marcus Vance',
    email: 'admin@househunt.com',
    password: 'password123',
    role: 'admin',
    phone: '+1 (555) 010-9900',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'HouseHunt Platform Moderator & Executive Administrator.',
  },
  {
    name: 'Sarah Sterling',
    email: 'landlord@househunt.com',
    password: 'password123',
    role: 'landlord',
    phone: '+1 (555) 014-4422',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bio: 'Premier Real Estate Investor managing luxury urban residences across prime metropolitan areas.',
  },
  {
    name: 'David Rossi',
    email: 'david@househunt.com',
    password: 'password123',
    role: 'landlord',
    phone: '+1 (555) 018-8833',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: 'Property developer & boutique loft specialist in Pacific Heights and SoHo.',
  },
  {
    name: 'Alex Johnson',
    email: 'tenant@househunt.com',
    password: 'password123',
    role: 'tenant',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Senior Software Engineer relocating to downtown metro. Passionate about modern architecture.',
  },
  {
    name: 'Rachel Green',
    email: 'rachel@househunt.com',
    password: 'password123',
    role: 'tenant',
    phone: '+1 (555) 012-7766',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    bio: 'UX Designer looking for bright, sun-lit spaces with balcony and pet-friendly policies.',
  },
];

const sampleProperties = (landlord1Id, landlord2Id) => [
  {
    title: 'The Skyview Penthouse & Glass Oasis',
    description: 'Immerse yourself in panoramic skyline views with floor-to-ceiling glass walls, private rooftop terrace with heated infinity pool, Italian marble countertops, Sub-Zero appliances, and 24/7 white-glove concierge services.',
    propertyType: 'Apartment',
    rentPrice: 4200,
    securityDeposit: 4200,
    address: '740 Park Avenue, Suite 34B',
    city: 'New York',
    state: 'NY',
    zipCode: '10021',
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2250,
    furnishedStatus: 'Furnished',
    amenities: ['High-speed WiFi', 'Swimming Pool', 'Gym / Fitness', 'Covered Parking', 'Pet Friendly', 'Air Conditioning', '24/7 Security', 'Balcony / Terrace', 'In-unit Laundry', 'Smart Lock'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'approved',
    owner: landlord1Id,
    rating: 4.9,
    numReviews: 8,
    featured: true,
  },
  {
    title: 'Modern Minimalist Coastal Villa',
    description: 'Designed by acclaimed California architects, this serene architectural masterpiece sits nestled in the scenic hills overlooking the ocean. Features open concept floorplan, zero-edge pool, gourmet kitchen, and private zen garden.',
    propertyType: 'Villa',
    rentPrice: 6500,
    securityDeposit: 6500,
    address: '28400 Pacific Coast Hwy',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90265',
    bedrooms: 4,
    bathrooms: 4,
    areaSqFt: 3800,
    furnishedStatus: 'Furnished',
    amenities: ['High-speed WiFi', 'Swimming Pool', 'Gym / Fitness', 'Covered Parking', 'Pet Friendly', 'Air Conditioning', '24/7 Security', 'Balcony / Terrace', 'Smart Lock'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'approved',
    owner: landlord1Id,
    rating: 5.0,
    numReviews: 12,
    featured: true,
  },
  {
    title: 'Urban Chic Loft in SoHo Historic District',
    description: 'Authentic cast-iron historic building conversion with exposed original brick, 14-foot timber beam ceilings, oversized southern facing windows, chef island with waterfall quartz, and custom walnut cabinetry.',
    propertyType: 'Studio',
    rentPrice: 2800,
    securityDeposit: 2800,
    address: '142 Mercer Street, Loft 3',
    city: 'New York',
    state: 'NY',
    zipCode: '10012',
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 980,
    furnishedStatus: 'Semi-Furnished',
    amenities: ['High-speed WiFi', 'Gym / Fitness', 'Pet Friendly', 'Air Conditioning', 'In-unit Laundry', 'Smart Lock'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'approved',
    owner: landlord2Id,
    rating: 4.8,
    numReviews: 5,
    featured: true,
  },
  {
    title: 'Waterfront Luxury Condo at South Beach',
    description: 'Direct turquoise ocean views from every room. Walk directly to the sand or lounge on the expansive wrap-around sunrise balcony. Includes state of the art fitness club, two valet parking spaces, and direct beach cabana privileges.',
    propertyType: 'Condo',
    rentPrice: 3800,
    securityDeposit: 3800,
    address: '100 Ocean Drive, Tower A',
    city: 'Miami',
    state: 'FL',
    zipCode: '33139',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1450,
    furnishedStatus: 'Furnished',
    amenities: ['High-speed WiFi', 'Swimming Pool', 'Gym / Fitness', 'Covered Parking', 'Air Conditioning', '24/7 Security', 'Balcony / Terrace', 'In-unit Laundry'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-2d1d07c089fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'approved',
    owner: landlord1Id,
    rating: 4.9,
    numReviews: 7,
    featured: true,
  },
  {
    title: 'Victorian Elegance in Pacific Heights',
    description: 'Tastefully restored Victorian home blending ornate period millwork, stained glass accents, and hardwood floors with ultra-contemporary kitchen amenities, private landscaped courtyard, and EV fast-charging garage.',
    propertyType: 'House',
    rentPrice: 5200,
    securityDeposit: 5200,
    address: '2245 Broadway Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94115',
    bedrooms: 3,
    bathrooms: 2,
    areaSqFt: 2100,
    furnishedStatus: 'Semi-Furnished',
    amenities: ['High-speed WiFi', 'Covered Parking', 'Pet Friendly', 'In-unit Laundry', 'Balcony / Terrace', 'Smart Lock'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'approved',
    owner: landlord2Id,
    rating: 4.7,
    numReviews: 4,
    featured: false,
  },
  {
    title: 'Downtown Austin High-Rise Executive Suite',
    description: 'Live in the beating heart of Austin tech district. Walk to Lady Bird Lake trails, Rainey Street dining, and downtown offices. Features keyless entry, smart home automation, rooftop infinity lounge, and dog run park.',
    propertyType: 'Apartment',
    rentPrice: 2400,
    securityDeposit: 2000,
    address: '360 Nueces Street, Unit 1804',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1120,
    furnishedStatus: 'Furnished',
    amenities: ['High-speed WiFi', 'Swimming Pool', 'Gym / Fitness', 'Covered Parking', 'Pet Friendly', 'Air Conditioning', '24/7 Security', 'In-unit Laundry'],
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'approved',
    owner: landlord1Id,
    rating: 4.8,
    numReviews: 9,
    featured: true,
  },
  {
    title: 'Emerald City Waterfront Townhome',
    description: 'Serene lakeside townhome with private dock access, panoramic views of Mount Rainier and Lake Union. Modern Scandinavian interiors with radiant heated floors and oversized deck.',
    propertyType: 'Townhouse',
    rentPrice: 3400,
    securityDeposit: 3000,
    address: '1820 Westlake Avenue N',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98109',
    bedrooms: 3,
    bathrooms: 2.5,
    areaSqFt: 1850,
    furnishedStatus: 'Furnished',
    amenities: ['High-speed WiFi', 'Covered Parking', 'Pet Friendly', 'Balcony / Terrace', 'In-unit Laundry', 'Smart Lock'],
    images: [
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'approved',
    owner: landlord2Id,
    rating: 4.9,
    numReviews: 6,
    featured: false,
  },
  {
    title: 'Sun-Drenched Brownstone in Back Bay',
    description: 'Charming historic brownstone steps from Commonwealth Avenue Mall and Copley Square. Features ornamental fireplaces, modern granite kitchen, built-in library shelving, and private courtyard.',
    propertyType: 'House',
    rentPrice: 3900,
    securityDeposit: 3900,
    address: '312 Marlborough Street',
    city: 'Boston',
    state: 'MA',
    zipCode: '02116',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1500,
    furnishedStatus: 'Furnished',
    amenities: ['High-speed WiFi', 'Air Conditioning', 'Pet Friendly', 'In-unit Laundry', '24/7 Security'],
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'approved',
    owner: landlord1Id,
    rating: 4.8,
    numReviews: 3,
    featured: false,
  },
  // Pending listings for Admin Moderation & Landlord status testing!
  {
    title: 'Modern Silicon Valley Tech Haven (Pending Approval)',
    description: 'Contemporary smart home in Palo Alto featuring rooftop solar arrays, Tesla Powerwall, acoustic soundproof home office studio, and heated saltwater pool.',
    propertyType: 'House',
    rentPrice: 5800,
    securityDeposit: 5800,
    address: '420 University Avenue',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94301',
    bedrooms: 4,
    bathrooms: 3,
    areaSqFt: 2900,
    furnishedStatus: 'Furnished',
    amenities: ['High-speed WiFi', 'Swimming Pool', 'Gym / Fitness', 'Covered Parking', 'Pet Friendly', 'Air Conditioning', 'Smart Lock'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'pending',
    owner: landlord1Id,
    rating: 5.0,
    numReviews: 0,
    featured: false,
  },
  {
    title: 'Skyline View Brick Loft in West Loop (Pending Approval)',
    description: 'Spacious 2-bedroom converted industrial loft in Chicago West Loop foodie corridor with skyline balcony and heated indoor garage spot.',
    propertyType: 'Apartment',
    rentPrice: 2750,
    securityDeposit: 2750,
    address: '910 W Randolph Street',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60607',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1350,
    furnishedStatus: 'Furnished',
    amenities: ['High-speed WiFi', 'Gym / Fitness', 'Covered Parking', 'Pet Friendly', 'In-unit Laundry', 'Balcony / Terrace'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    isAvailable: true,
    status: 'pending',
    owner: landlord2Id,
    rating: 5.0,
    numReviews: 0,
    featured: false,
  },
];

const seedData = async () => {
  try {
    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany();
    await Property.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('🌱 Seeding users with encrypted credentials...');
    // Create users individually so pre('save') bcrypt hook hashes passwords properly
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const landlord1 = createdUsers.find((u) => u.email === 'landlord@househunt.com');
    const landlord2 = createdUsers.find((u) => u.email === 'david@househunt.com');
    const tenant1 = createdUsers.find((u) => u.email === 'tenant@househunt.com');
    const tenant2 = createdUsers.find((u) => u.email === 'rachel@househunt.com');

    console.log('🏡 Seeding curated luxury & urban property listings...');
    const propertiesToInsert = sampleProperties(landlord1._id, landlord2._id);
    const createdProperties = await Property.insertMany(propertiesToInsert);

    console.log('⭐ Seeding authentic user reviews & ratings...');
    const reviews = [
      {
        property: createdProperties[0]._id,
        user: tenant1._id,
        rating: 5,
        comment: 'Absolutely breathtaking views! The concierge is exceptionally responsive, and the heated rooftop pool is pure bliss after a long workday.',
      },
      {
        property: createdProperties[0]._id,
        user: tenant2._id,
        rating: 5,
        comment: 'High end finishes throughout. The smart home controls and sound insulation are top tier.',
      },
      {
        property: createdProperties[1]._id,
        user: tenant1._id,
        rating: 5,
        comment: 'An architectural dream. The sunset from the zero-edge pool overlooking the Pacific is unforgettable.',
      },
      {
        property: createdProperties[2]._id,
        user: tenant2._id,
        rating: 5,
        comment: 'Best location in SoHo! Quiet street yet two blocks from the best cafes and designer shops.',
      },
    ];
    await Review.insertMany(reviews);

    console.log('📅 Seeding demo rental and tour visit bookings...');
    const bookings = [
      {
        property: createdProperties[0]._id,
        user: tenant1._id,
        owner: landlord1._id,
        visitType: 'visit',
        checkInDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        preferredTime: '02:00 PM',
        status: 'confirmed',
        totalAmount: 0,
        notes: 'Looking forward to viewing the terrace and master bedroom suite.',
        ownerResponse: 'Confirmed! The concierge will have a guest pass ready at the front desk.',
      },
      {
        property: createdProperties[1]._id,
        user: tenant1._id,
        owner: landlord1._id,
        visitType: 'rental',
        checkInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        checkOutDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'pending',
        totalAmount: 13000,
        notes: 'Submitted verification documents and credit score report.',
      },
      {
        property: createdProperties[2]._id,
        user: tenant2._id,
        owner: landlord2._id,
        visitType: 'visit',
        checkInDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        preferredTime: '11:00 AM',
        status: 'pending',
        totalAmount: 0,
        notes: 'Interested in a 12-month lease starting next month.',
      },
    ];
    await Booking.insertMany(bookings);

    console.log('✨ HouseHunt Database successfully seeded!');
    console.log('----------------------------------------------------');
    console.log('👤 Admin:    admin@househunt.com    | password123');
    console.log('🏠 Landlord: landlord@househunt.com | password123');
    console.log('🔑 Tenant:   tenant@househunt.com   | password123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  }
};

// Automatic seed if database is empty on start
const seedDataIfNeeded = async () => {
  const count = await Property.countDocuments();
  if (count === 0) {
    console.log('ℹ️ Database is empty, populating initial demo datasets...');
    await seedData();
  }
};

// If run directly via `node utils/seeder.js`
if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedData();
    process.exit(0);
  });
}

module.exports = { seedData, seedDataIfNeeded };
