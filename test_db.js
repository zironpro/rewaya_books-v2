const mongoose = require("mongoose");

async function check() {
  await mongoose.connect("mongodb+srv://zadic42:mohammedSDK4141@cluster0.w7dqq.mongodb.net/rewaya?retryWrites=true&w=majority&appName=Cluster0");
  const orders = await mongoose.connection.db.collection('orders').find({}).toArray();
  console.log("Total orders in DB:", orders.length);
  orders.forEach(o => {
      console.log(`ID: ${o._id}, Status: ${o.status}, Created: ${o.createdAt}`);
  });
  mongoose.disconnect();
}
check();
