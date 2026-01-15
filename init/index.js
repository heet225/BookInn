const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initialdata = require("./data.js");

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BookInn");
}

// init/index.js (only showing the changed part)
const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Cleared existing listings");

    // Assign a default owner to each listing
    initialdata.data = initialdata.data.map((obj) => ({
      ...obj,
      owner: "6942cd11bcdeefc946172fd9", // Replace with a valid user ID from your database
    }));

    await Listing.insertMany(initialdata.data);
    console.log("Inserted initial data");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initDB()
  .then(() => {
    console.log("Database initialization complete");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
    mongoose.connection.close();
  });
