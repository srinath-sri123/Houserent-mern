const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/househunt';

  try {
    // Try connecting to the specified MongoDB URI first (local or remote/Atlas)
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fallback if no standalone mongod
    });

    console.log(`✅ MongoDB Connected to Live Server: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Live MongoDB connection to ${uri} failed (${error.message}).`);
    console.log('🔄 Initializing embedded in-memory MongoDB fallback server for seamless development...');

    try {
      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '4.4.18',
        },
      });
      const inMemoryUri = mongoServer.getUri();

      const conn = await mongoose.connect(inMemoryUri);
      console.log(`✅ In-Memory MongoDB Connected: ${inMemoryUri}`);

      // Automatically populate seed data for immediate use
      const { seedDataIfNeeded } = require('../utils/seeder');
      await seedDataIfNeeded();

      return conn;
    } catch (inMemErr) {
      console.error(`❌ Critical Database Error: ${inMemErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
