const Model = require('../models/ModelModel');
const ModelData = require('../models/ModelDataModel');

const fs = require('fs');
const { createCanvas } = require('canvas');
const Chart = require('chart.js/auto');
const path = require('path');



const init_model = async (req, res) => {
  let model, modelData;
  let data = JSON.parse(req.body.json);

  try {
    if (!data.model_config){
      return res.status(500).send("Please, specifiy a configuration object")
    }
    if (data.model_config.model_name) {
      console.log("Initializing Model and ModelData...")
      // Fetching model if exist
      model = await Model.findOne({ model_name: data.model_config.model_name });
      if (!model) {
        // Creating model and modelData if it doesn't exist\
        const { model_name } = data.model_config;
        model = new Model({model_name});
        modelData = new ModelData({ modelID: model._id });
        console.log("created")
      } else {
        modelData = await ModelData.findOne({modelID: model._id})
      }
    }

    console.log("Successfuly initialized a Model and ModelData")
    console.log("Uploading files...")

    if (req.files && req.files.length > 0) {
      // Ensure model_arch exists and initialize it if needed
      modelData.model_arch = modelData.model_arch || {};
      modelData.model_arch.reference_string = req.files[0].path;
      modelData.model_arch.meta_data = {
        fieldname: req.files[0].fieldname,
        originalname: req.files[0].originalname,
        encoding: req.files[0].encoding,
        mimetype: req.files[0].mimetype,
        filename: req.files[0].filename,
        size: req.files[0].size
      };

      modelData.files = req.files.map(file => ({
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

    // console.log(req.file)
    console.log("---------------")
    console.log("Files uploaded!")
    console.log("---------------")

    if (data.params) {
      modelData.params = data.params;
      for (let key in data.params.automatic_data) {
        console.log("Fine till here")
        console.log(data.params.automatic_data)
        for (let key in data.params.automatic_data) {
          if (data.params.automatic_data.hasOwnProperty(key)) {
            await plotModelData(data.params.automatic_data[key], 'line', key);
          }
        }
      }
    }
    // console.log("fine here")

    if (data.params) {
      modelData.params = data.params
    }

    if (model) {
      await model.save();
    }

    await modelData.save();
    console.log("All saved :)");
    return res.status(200).send("Operation Successful");
  } catch (error) {
    return res.status(500).send("Couldn't initialize model. Please revise the provided data." );
  }
};

const uploadModelFiles = async (req, res) => {
  try {
    const modelData = await ModelData.findOne({ modelID: data.model_id });
    if (!modelData) {
      return res.status(404).send("No model found with the specified Id..." );
    }

    modelData.files = req.files.map(file => ({
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

    modelData.params.automatic_data = data.params.automatic_data;
    modelData.params.manual_data = data.params.manual_data;
    await modelData.save();
    
    res.status(201).send('Files uploaded successfully!');
  } catch (error) {
    res.status(500).send(error);
  }
};


const updateModel = async (req, res) => {
  const updateKeys = Object.keys(data)
  const allowedUpdates = ['model_name', 'description'];
  const validUpdate = updateKeys.every((update) => allowedUpdates.includes(update))
  
  try{
    if(!validUpdate){
      return res.status(400).send('You cant update these values')
    }

    const model = await Model.findOne({_id: req.params.id});
    updateKeys.forEach((key) => model[key] = data[key])
    await model.save()
    res.status(200).send(model)
  } catch(err){
    res.status(500).send(err)
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
    console.log("here")
  
    const graphPath = path.join(graphDir, `${title}.png`);
    fs.writeFileSync(graphPath, canvas.toBuffer());

    console.log(`Chart has been saved as ${graphPath}`);
  } catch (error) {
    console.error("Error creating the chart:", error);
  }
};



module.exports = {
  init_model,
  // createModel,
  updateModel,
  uploadModelFiles
};
