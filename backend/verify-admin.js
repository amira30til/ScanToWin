require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const verifyAdmin = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      console.error('? MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('? Connected to MongoDB');

    // Find all admins
    const admins = await Admin.find({}).select('+password');
    
    console.log(`\n?? Found ${admins.length} admin(s) in database:\n`);
    
    admins.forEach((admin, index) => {
      console.log(`Admin ${index + 1}:`);
      console.log(`  ID: ${admin._id}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Status: ${admin.adminStatus}`);
      console.log(`  Has Password: ${admin.password ? 'Yes' : 'No'}`);
      console.log(`  Created: ${admin.createdAt}`);
      console.log('');
    });

    // Try to find the specific admin
    const testEmail = 'admin@example.com';
    const foundAdmin = await Admin.findOne({ 
      email: testEmail.toLowerCase() 
    }).select('+password +adminStatus');
    
    if (foundAdmin) {
      console.log(`? Found admin with email: ${testEmail}`);
      console.log(`   Email stored as: "${foundAdmin.email}"`);
      console.log(`   Role: ${foundAdmin.role}`);
      console.log(`   Status: ${foundAdmin.adminStatus}`);
    } else {
      console.log(`? Admin with email "${testEmail}" NOT FOUND`);
      console.log(`   Searching for exact match...`);
      
      // Try case-insensitive search
      const allAdmins = await Admin.find({});
      const matchingAdmin = allAdmins.find(a => 
        a.email && a.email.toLowerCase() === testEmail.toLowerCase()
      );
      
      if (matchingAdmin) {
        console.log(`   Found similar email: "${matchingAdmin.email}"`);
      }
    }

    await mongoose.disconnect();
    console.log('\n? Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('? Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

verifyAdmin();
