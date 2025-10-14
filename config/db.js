// const mongoose = require("mongoose");
// require("dotenv").config();

// async function connectDB(params) {
//   try {
//     await mongoose.connect(process.env.MongoURI, {
//       dbName: process.env.dbName,
//     });
//     console.log("connected with " + process.env.dbName + " database");
//   } catch (error) {}
// }

// module.exports = { connectDB };

const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGOURI, {
      dbName: process.env.DBNAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected with " + process.env.DBNAME + " database");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Stop the server if DB fails
  }
}

module.exports = { connectDB };
