const fs = require('fs');
const { createCanvas } = require('canvas');
const Chart = require('chart.js/auto');
const path = require('path');
const ModelData = require('../models/ModelDataModel.js');
const mongoose = require('mongoose');
// const { ObjectId } = require('mongodb');
var ObjectID = require('mongodb').ObjectID;

const createModelData = async (req, res) => {
  const modelData = new ModelData(req.body);

  try {
      await modelData.save();
      res.status(201).send(model);
  } catch (error) {
      res.status(500);
  }
}

const uploadModelFiles = async (req, res) => {
  try {
      const modelData = await ModelData.find({ modelID: req.body.modelID });
      for (let key in req.body.params.automatic_data) {
        if (req.body.params.automatic_data.hasOwnProperty(key)) {
          await plotModelData(req.body.params.automatic_data[key], 'line', key);
        }
      }
      modelData.model_arch = req.file.path
      modelData.params.automatic_data = req.body.params.automatic_data
      modelData.params.manual_data = req.body.params.manual_data
      await modelData.save()
      console.log("Data received from 7ggoo")
      res.status(201).send('File uploaded successfully!');
      return;
    } catch (error) {
        res.status(500).send(error);
    }
  }

  const plotModelData = async (data, type = 'line', title = 'Chart') => {
    try {
      console.log("Creating graph");
      console.log(data);
      
      const width = 800;
      const height = 600;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
  
      console.log("Canvas created");
  
      // Create the chart
      new Chart(ctx, {
        type: type, // Chart type: 'line', 'bar', etc.
        data: {
          labels: data.map((_, i) => i + 1), // X-axis labels (e.g., [1, 2, 3, ...])
          datasets: [{
            label: title, // Chart title
            data: data, // Data points
            fill: false, // No fill under the line
            borderColor: 'rgba(75, 192, 192, 1)', // Line color
            backgroundColor: 'rgba(75, 192, 192, 0.2)' // Point color
          }]
        },
        options: {
          responsive: false, // Make the chart non-responsive
          title: {
            display: true,
            text: title
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Epoch'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Value'
              }
            }]
          }
        }
      });
  
      console.log("Chart created");
  
      // Ensure the graph directory exists
      const graphDir = path.join(__dirname, '../graph');
      if (!fs.existsSync(graphDir)) {
        fs.mkdirSync(graphDir);
      }
  
      console.log("Graph directory checked/created");
  
      const graphPath = path.join(graphDir, `${title}.png`);
      fs.writeFileSync(graphPath, canvas.toBuffer());
  
      console.log(`Chart has been saved as ${graphPath}`);
    } catch (error) {
      console.error("Error creating the chart:", error);
    }
  };

// const downloadModelFiles = async (req, res) => {
//   try {
//     const { fileId } = req.params;

//     // Check if file exists
//     console.log(bucket)
//     const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
//     if (file.length === 0) {
//     return res.status(404).json({ error: { text: "File not found" } });
//     }

//     // set the headers
//     res.set("Content-Type", file[0].contentType);
//     res.set("Content-Disposition", `attachment; filename=${file[0].filename}`);

//     // create a stream to read from the bucket
//     const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

//     // pipe the stream to the response
//     downloadStream.pipe(res);
// } catch (error) {
//     console.log(error);
//     res.status(400).json({error: { text: `Unable to download file`, error }});
// }
//   };

module.exports = {
  createModelData,
  uploadModelFiles,
  // downloadModelFiles
};
