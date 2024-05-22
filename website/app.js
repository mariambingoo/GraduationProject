// app.js
require('dotenv').config({path: './config/dev.env'})
require('./models/database')
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const trainingDataRouter = require('./routes/trainingData');
const PackageRouter = require('./routes/PackageRouter');
// const modelWeightsRouter = require('./routes/modelWeights');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/package', PackageRouter);
app.use('/ui', uiRouter);
//app.use('/modelWeights', modelWeightsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
