body: {
  "params": {
          "automatic_data": {
              "training_loss": [
                  0.7013490796089172,
                  0.6962673068046578
              ],
              "training_accuracy": [
                  0.5012500286102295,
                  0.5074999928474426
              ],
              "validation_loss": [
                  0.6998642683029175,
                  0.6993296742439273
              ],
              "validation_accuracy": [
                  0.45500001311302185,
                  0.43500000238418583
              ]
          },
          "manual_data": {"test": "teeessstt"}
  },
  // contains run information from the package's init_run
  "run_config": {
          "run_name": "example_run", // required
          "model_name": "example_model" // not required
  },
  // or will be model_config in case of model_init
  "model_config": {
          "model_name": "example_model" // required
          "description": "example_desc"
          "run_name": "example_run", // not required
  }
}
