
const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/sidbnb";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // first delete the data then insert data from data.js
  await listing.deleteMany({});
  await listing.insertMany(initData.data);////const initdata is  an obj  and key is data from  module.exports = { data: sampleListings };
  console.log("data was initialized");
};

initDB();