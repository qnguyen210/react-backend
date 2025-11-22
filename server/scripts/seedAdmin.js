// Simple admin seed script
// Usage: node server/scripts/seedAdmin.js
// Ensures an admin user exists with provided credentials.

import mongoose from 'mongoose';
import config from '../../config/config.js';
import User from '../models/user.model.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPass123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(config.mongoUri);

  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (admin) {
    // ensure role is admin
    if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
      console.log('Updated existing user to admin role:', ADMIN_EMAIL);
    } else {
      console.log('Admin user already exists:', ADMIN_EMAIL);
    }
  } else {
    admin = new User({ name: ADMIN_NAME, email: ADMIN_EMAIL });
    admin.password = ADMIN_PASSWORD; // triggers virtual setter
    admin.role = 'admin';
    await admin.save();
    console.log('Created new admin user:', ADMIN_EMAIL);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
