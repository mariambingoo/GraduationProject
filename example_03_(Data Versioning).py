from experiment_tracker import DatasetVersioning, ExperimentInitializer

# Initialize RunInitializer with configuration
run_config = {
    "project_name": "example_project",
    "model_name": "example_model",
    "description": "Example run with a simple model for binary classification.",
}

experiment = ExperimentInitializer()
model_init = experiment.init_model(run_config)
model_init.Track_Data("SampleDataset")

# Initialize the DatasetVersioning with the path to the dataset
dataset_path = "SampleDataset"
dataset_versioning = DatasetVersioning(dataset_path)

# Send the data to the server
model_init.finalize()
