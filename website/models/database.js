const mongoose = require('mongoose');
require('dotenv').config({ path: '../config/dev.env' });

mongoose.connect(process.env.MONGOOSE_URL);

mongoose.connection.once('connected', () =>{
    console.log("Welcome on board to the Krusty Krab")
})
// const getBucket = async () => { // Use async/await for cleaner connection handling
//   if (!bucket) {
//     await mongoose.connection.on("connected", () => {
//       bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//         bucketName: "filesBucket",
//       });
//     });
//   }
//   return bucket;
// };

// module.exports = { getBucket };
