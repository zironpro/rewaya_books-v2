import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import connectToDatabase from "../src/lib/db/mongodb";
import { Product } from "../src/lib/db/models/Product";
import mongoose from "mongoose";

async function fixSortOrder() {
  console.log("Connecting to database...");
  await connectToDatabase();
  console.log("Connected. Fetching products...");
  
  // Sort by createdAt ascending so older products get lower sort order
  const products = await Product.find({}).sort({ createdAt: 1 });
  
  console.log(`Found ${products.length} products. Updating sortOrder...`);
  
  for (let i = 0; i < products.length; i++) {
    products[i].sortOrder = i + 1;
    await products[i].save();
  }
  
  console.log(`Successfully updated ${products.length} products with sequential sortOrder.`);
  await mongoose.disconnect();
}

fixSortOrder().catch(console.error);
