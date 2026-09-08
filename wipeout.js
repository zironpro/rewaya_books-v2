require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const MONGODB_URI = process.env.MONGODB_URI;

async function wipeout() {
  console.log("Starting wipeout...");
  try {
    if (!MONGODB_URI) throw new Error("MONGODB_URI not found in .env.local");
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Dropping database...");
    await mongoose.connection.db.dropDatabase();
    console.log("Database wiped out successfully.");
    
    console.log("Wiping out Cloudinary resources...");
    let nextCursor = null;
    let totalDeleted = 0;
    
    do {
       const result = await cloudinary.api.delete_all_resources({ next_cursor: nextCursor });
       const deletedCount = Object.keys(result.deleted || {}).length;
       totalDeleted += deletedCount;
       console.log(`Deleted ${deletedCount} images...`);
       nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log(`Cloudinary wipeout complete. Total deleted: ${totalDeleted}`);
  } catch (error) {
    console.error("Error during wipeout:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

wipeout();
