import connectToDatabase from "../src/lib/db/mongodb";
import { Product } from "../src/lib/db/models/Product";
import { Category } from "../src/lib/db/models/Category";
import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function syncCategories() {
  console.log("Connecting to database...");
  await connectToDatabase();
  console.log("Connected. Fetching all categories...");
  
  const categories = await Category.find({});
  for (const cat of categories) {
    // Find all products matching this category by ID
    const productsById = await Product.find({ categoryId: cat._id.toString() }).sort({ sortOrder: 1, createdAt: -1 });
    
    // Find products matching by name or slug that MIGHT have a missing or incorrect categoryId
    const productsByName = await Product.find({ 
        $or: [
            { categoryName: cat.name },
            { categorySlug: cat.slug }
        ],
        categoryId: { $ne: cat._id.toString() } 
    }).sort({ sortOrder: 1, createdAt: -1 });
    
    // Update these orphaned products to point to the correct categoryId
    for (const p of productsByName) {
        p.categoryId = cat._id.toString();
        p.categoryName = cat.name;
        p.categorySlug = cat.slug;
        await p.save();
    }
    
    const allProducts = [...productsById, ...productsByName];
    
    // Update the Category document's array and count
    cat.products = allProducts.map(p => p._id);
    cat.count = allProducts.length;
    await cat.save();
    
    console.log(`Synced Category: ${cat.name} with ${cat.count} products.`);
  }
  
  console.log(`Successfully synced ${categories.length} categories.`);
  await mongoose.disconnect();
}

syncCategories().catch(console.error);
