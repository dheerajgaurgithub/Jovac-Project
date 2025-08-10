const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function fixDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testgenerator', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // List current indexes
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes);
    
    // Drop problematic username index if it exists
    try {
      await usersCollection.dropIndex('username_1');
      console.log('Dropped username_1 index');
    } catch (error) {
      console.log('Username index not found or already dropped');
    }
    
    // Ensure email index exists and is unique
    try {
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      console.log('Created/ensured email unique index');
    } catch (error) {
      console.log('Email index already exists');
    }
    
    // List indexes after cleanup
    const newIndexes = await usersCollection.indexes();
    console.log('Indexes after cleanup:', newIndexes);
    
    console.log('Database fix completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabase();
