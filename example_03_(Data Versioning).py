from os.path import dirname, abspath, join
from experiment_tracker import DatasetVersioning

script_dir = dirname(abspath(__file__))


# Initialize the DatasetVersioning with the path to the dataset
dataset_path = "SampleDataset"
file_path = join(script_dir, dataset_path)
dataset_versioning = DatasetVersioning(file_path)

# Generate the metadata and save it to a JSON file
dataset_versioning.generate_metadata("dataset_metadata.json")
