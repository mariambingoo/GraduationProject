// app.js
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const traindingDataRouter = require('./routes/trainingData');
// const modelWeightsRouter = require('./routes/modelWeights');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/ModelData', traindingDataRouter);
//app.use('/modelWeights', modelWeightsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
