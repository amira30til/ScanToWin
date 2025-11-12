require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      console.error('? MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('? Connected to MongoDB');

    // Check if super admin already exists and delete it to recreate
    const email = 'admin@example.com'.toLowerCase().trim();
    const existingAdmin = await Admin.findOne({ 
      email: email
    });

    if (existingAdmin) {
      console.log('??  Found existing admin with email: ' + email);
      console.log('   Stored email in DB: "' + existingAdmin.email + '"');
      console.log('   Deleting existing admin to recreate...');
      await Admin.deleteOne({ _id: existingAdmin._id });
      console.log('   ? Existing admin deleted');
    }

    // Create super admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const superAdmin = new Admin({
      firstName: 'Super',
      lastName: 'Admin',
      email: email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      adminStatus: 'ACTIVE',
    });

    await superAdmin.save();

    console.log('? Super admin created successfully!');
    console.log('');
    console.log('?? Login credentials:');
    console.log('   Email: ' + email);
    console.log('   Password: admin123');
    console.log('   Stored email in DB: "' + superAdmin.email + '"');
    console.log('');

    await mongoose.disconnect();
    console.log('? Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('? Error seeding super admin:', error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedSuperAdmin();
