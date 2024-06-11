const Model = require('../models/ModelModel');
const Run = require('../models/RunModel.js');
const RunData = require('../models/RunDataModel.js');
const fs = require('fs');
const { createCanvas } = require('canvas');
const Chart = require('chart.js/auto');
const path = require('path');

const init_run = async (req, res) => {
  let model, run, runData;
  let data = JSON.parse(req.body.json);

  try {
    if (!data.run_config){
      return res.status(500).send("Please, specify a configuration object")
    }

    const { run_name } = data.run_config

    if (data.run_config.model_name) {
      // Fetching model if exist
      model = await Model.findOne({ model_name: data.run_config.model_name });

      if (!model) {
        return res.status(404).send("No model with that name exist")
      }
      run = new Run({ run_name, modelID: model._id })
    } else {
      run = new Run({ run_name })
    }

    runData = new RunData({ runID: run._id })

    console.log("Successfuly initialized a Run and RunData")
    console.log("Uploading files...")

    if (req.files && req.files.length > 0) {
      runData.files = req.files.map(file => ({
        reference_string: file.path,
        meta_data: {
          fieldname: file.fieldname,
          originalname: file.originalname,
          encoding: file.encoding,
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size
        }
      }));
    }

    console.log("Files uploaded!")


    if (data.params) {
      runData.params = data.params;
      // loop over automatic_data and plot the data
      for (let key in data.params.automatic_data) {
        if (data.params.automatic_data.hasOwnProperty(key)) {
          await plotModelData(data.params.automatic_data[key], 'line', key);
        }
      }
    }

    if (run) {
      await run.save();
    }

    await runData.save();
    console.log("All saved :)")
    return res.status(200).send("Operation Successful");
  } catch (error) {
    return res.status(500).send("Couldn't initialize run. Please revise the provided data.");
  }
}

const plotModelData = async (data, type = 'line', title = 'Chart') => {
  try {    
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
  
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
        responsive: false,
        title: {
          display: true,
          text: title
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Epoch'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            }
          }
        }
      }
    });
  
    // Ensure the graph directory exists
    const graphDir = path.join(__dirname, '../graph');
    if (!fs.existsSync(graphDir)) {
      fs.mkdirSync(graphDir);
    }
  
    const graphPath = path.join(graphDir, `${title}.png`);
    fs.writeFileSync(graphPath, canvas.toBuffer());

    console.log(`Chart has been saved as ${graphPath}`);
  } catch (error) {
    console.error("Error creating the chart:", error);
  }
};


// const uploadRunFiles = async (req, res) => {
//   try {
//     const runData = await RunData.findOne({ runID: req.body.run_id });
//     if (!runData) {
//       return res.status(404).send("No Run found with the specified Id..." );
//     }

//     modelData.files = req.files.map(file => ({
//       reference_string: file.path,
//       meta_data: {
//         fieldname: file.fieldname,
//         originalname: file.originalname,
//         encoding: file.encoding,
//         mimetype: file.mimetype,
//         filename: file.filename,
//         size: file.size
//       }
//     }));

//     modelData.params.automatic_data = req.body.params.automatic_data;
//     modelData.params.manual_data = req.body.params.manual_data;
//     await modelData.save();
    
//     res.status(201).send('Files uploaded successfully!');
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

module.exports = {
  init_run,
  // uploadRunFiles
};
