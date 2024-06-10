const Model = require('../models/ModelModel');
const Run = require('../models/RunModel.js');
const RunData = require('../models/RunDataModel.js');

const init_run = async (req, res) => {
  let model, run, runData;

  try {
    if (!req.body.run_config){
      return res.status(500).send("Please, specify a configuration object")
    }

    const { run_name } = req.body.run_config

    if (req.body.run_config.model_name) {
      // Fetching model if exist
      model = await Model.findOne({ model_name: req.body.run_config.model_name });

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


    if (req.body.params) {
      runData.params = req.body.params
    }

    if (run) {
      await run.save();
    }

    await runData.save();
    console.log("All saved :)")
    return res.status(200).send("Operation Successful");
  } catch (error) {
    return res.status(500).send({ error: "Couldn't initialize run. Please revise the provided data." });
  }
}


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
