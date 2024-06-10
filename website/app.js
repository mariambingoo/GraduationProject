// app.js
require('dotenv').config({ path: './config/dev.env' })
require('./models/database')
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
// const trainingDataRouter = require('./routes/trainingData');
const PackageRouter = require('./routes/PackageRouter');
const UIRouter = require('./routes/UIRouter');
const UserRouter = require('./routes/UserRouter');
const multer = require('multer');
const upload = multer();
const {uploadFiles} = require('./middleware/upload_files')

// const modelWeightsRouter = require('./routes/modelWeights');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.json());

// app.use(upload.array());

// Routes
app.use('/package', PackageRouter);
app.use('/ui', UIRouter);
app.use('/user', UserRouter);

// app.post('/upload', uploadFiles, (req, res) => {
//   console.log("a7a")
//   console.log(req.files)
//   res.json(req.files)
// });
// app.use('/trainingData', trainingDataRouter);


//app.use('/modelWeights', modelWeightsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
