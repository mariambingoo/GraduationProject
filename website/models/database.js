const mongoose = require('mongoose')
require('dotenv').config({path: '../config/dev.env'})

mongoose.connect(process.env.MONGOOSE_URL)

let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

