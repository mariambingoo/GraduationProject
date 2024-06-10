import json
from tensorflow.keras.callbacks import Callback
from os import unlink
from tempfile import NamedTemporaryFile
from ..utils.UploadToEndpoints import upload_to_endpoint
from pathlib import Path
from ..versioning.DatasetVersioning import DatasetVersioning
import requests
from keras.utils import plot_model


class MetricsCollector(Callback):
    """
    A callback class for collecting and exporting model training metrics to a JSON file.

    Usage:
    Instantiate the class and use it as a callback during model training to collect metrics after each epoch.
    Call the `send_json` method to export the collected metrics to a JSON file.
    Note: on_epoch_end() method is called by Keras at the end of each epoch (it is overridden).
    This method collects the training metrics and it is called automatically during model training.

    Example:
    ```python
    from experiment_tracker.metrics_collector import MetricsCollector
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense

    # Define a Keras model
    model = Sequential([
        Dense(64, activation='relu', input_shape=(10,)),
        Dense(1, activation='sigmoid')
    ])

    # Compile the model
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    # Create an instance of MetricsCollector
    metrics_collector = MetricsCollector()

    # Train the model with MetricsCollector as a callback
    history = model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_val, y_val), callbacks=[metrics_collector])

    # Export the collected metrics to a JSON file
    metrics_collector.send_json("metrics.json")
    ```

    Attributes:
        None

    Methods:
        send_json(filename="results.json"):
            Exports the collected training metrics to a JSON file.

    """

    def __init__(self):
        super(MetricsCollector, self).__init__()
        self.losses = []
        self.accuracies = []
        self.val_losses = []
        self.val_accuracies = []
        self.additional_metrics = {}

    def __setitem__(self, key, value):
        """Allow adding arbitrary key-value pairs to the metrics dictionary."""
        self.additional_metrics[key] = value

    def on_epoch_end(self, epoch, logs=None):
        self.losses.append(logs["loss"])
        self.accuracies.append(logs["accuracy"])
        self.val_losses.append(logs["val_loss"])
        self.val_accuracies.append(logs["val_accuracy"])

    def print_metrics(self):
        metrics_dict = {
            "params": {
                "automatic_data": {
                    "training_loss": self.losses,
                    "training_accuracy": self.accuracies,
                    "validation_loss": self.val_losses,
                    "validation_accuracy": self.val_accuracies,
                },
                "manual_data": {
                    **self.additional_metrics
                },  # Include additional metrics
            }
        }
        return metrics_dict


class ModelVisualizer:
    """
    A utility class for visualizing the architecture of Keras models.

    Usage:
    Instantiate the class and call the static method `visualize_model` to generate
    and save a visualization of a Keras model's architecture.

    Example:
    ```python
    from experiment_tracker.model.model_visualizer import ModelVisualizer
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense

    # Define a Keras model
    model = Sequential([
        Dense(64, activation='relu', input_shape=(10,)),
        Dense(1, activation='sigmoid')
    ])

    # Visualize the model and save the plot to a file
    ModelVisualizer.visualize_model(model, 'model_plot.png')
    ```

    Attributes:
        None

    Methods:
        visualize_model(model, plot_filename):
            Generates a visualization of the architecture of a Keras model and saves it to a file.

    """

    @staticmethod
    def visualize_model(model, plot_filename="model_plot.png"):
        """
        Generates a visualization of the architecture of a Keras model and saves it to a file.

        Parameters:
            model (tensorflow.keras.Model): The Keras model to visualize.
            plot_filename (str): The filename to save the plot.

        Raises:
            ValueError: If the provided model is not a Keras model instance.
        """
        try:
            plot_model(
                model, to_file=plot_filename, show_shapes=True, show_layer_names=True
            )
        except Exception as e:
            print(f"Error visualizing model: {e}")


class ExperimentInitializer:
    def __init__(self):
        """
        Initialize the experiment tracking run/model with the given configuration.
        """

    def init_run(self, config):
        return RunInitializer(config)

    def init_model(self, config):
        """Initialize the model with the given configuration:

        Parameters:
        config (dict): A dictionary containing configuration parameters:
            - run_name (str): The name of the run.
            - project_name (str): The name of the project.
            - api_token (str): The API token for authentication.
            - model_name (str): The name of the model.

        """
        return ModelInitializer(config)


class RunInitializer:
    """Initialize the run with the given configuration:

    Parameters:
    config (dict): A dictionary containing configuration parameters:
        - run_name (str): The name of the run.
        - project_name (str): The name of the project.
        - model_name (str): The name of the model.

    """

    def __init__(self, config):
        self.run_name = config.get("run_name")
        self.project_name = config.get("project_name")
        self.model_name = config.get("model_name")
        self.description = config.get("description")
        self._validate_config()
        self.metrics_collector = MetricsCollector()
        print(
            f"Initializing run '{self.run_name}' for project '{self.project_name}' with model '{self.model_name}'."
        )

    def _validate_config(self):
        if not self.run_name:
            raise ValueError("Run name is required.")
        if not self.project_name:
            raise ValueError("Project name is required.")
        if not self.model_name:
            raise ValueError("Model name is required.")

    def MetricsCollector(self):
        return self.metrics_collector

    def ModelVisualizer(self):
        return ModelVisualizer()

    def collect_and_send_data(self, model, endpoint_url):
        """
        Collects parameters, model architecture image, and model file, and sends them in a single request.

        :param model: The Keras model to save and visualize.
        :param endpoint_url: The endpoint URL to send the request to.
        """
        # Collect metrics
        metrics_dict = self.metrics_collector.print_metrics()
        metrics_dict["run"] = {
            "model_name": self.model_name,
            "description": self.description,
            "project_name": self.project_name,
            "run_name": self.run_name,
        }

        # Visualize model architecture
        plot_file_path = "model_plot.png"
        ModelVisualizer().visualize_model(model, plot_file_path)

        # Save model to a temporary file
        with NamedTemporaryFile(
            prefix="model_", suffix=".keras", delete=False
        ) as temp_model_file:
            model_file_path = temp_model_file.name
            model.save(model_file_path)
        # Prepare files for the request
        files = {
            "file_arc": (Path(model_file_path).name, open(model_file_path, "rb")),
            "file_plot": (plot_file_path, open(plot_file_path, "rb")),
        }
        print(files)
        print(json.dumps(metrics_dict))
        # Send request
        try:
            response = requests.post(
                endpoint_url, files=files, data={"json": json.dumps(metrics_dict)}
            )
            print(response.json())
            response.raise_for_status()
            print(f"Successfully uploaded data: {response.json()}")
        except Exception as e:
            print(f"Error uploading data: {e}")
        finally:
            # Clean up temporary files
            for file in files.values():
                file[1].close()
            unlink(model_file_path)
            unlink(plot_file_path)

    def finalize(self, model):
        self.collect_and_send_data(model, "http://127.0.0.1:5000/package/run/create")
        print("All is done. Run Created")


class ModelInitializer:
    def __init__(self, config):
        self.model_name = config.get("model_name")
        self.description = config.get("description")
        self.project_name = config.get("project_name")
        self._validate_config()
        self.metrics_collector = MetricsCollector()

    def _validate_config(self):
        if not self.model_name:
            raise ValueError("Model name is required.")

    def MetricsCollector(self):
        return self.metrics_collector

    def ModelVisualizer(self):
        return ModelVisualizer()

    def Track_Data(self, filepath):
        self.generated_data = DatasetVersioning(filepath).generate_metadata(
            "dataset_metadata.json"
        )
        try:
            upload_to_endpoint(
                "trackData",
                self.generated_data,
                "http://localhost:3000/ModelData/trackData",
            )
        except Exception as e:
            print(f"Error uploading file (trackData): {e}")

    def collect_and_send_data(self, model, endpoint_url):
        """
        Collects parameters, model architecture image, and model file, and sends them in a single request.

        :param model: The Keras model to save and visualize.
        :param endpoint_url: The endpoint URL to send the request to.
        """
        # Collect metrics
        metrics_dict = self.metrics_collector.print_metrics()
        metrics_dict["model"] = {
            "model_name": self.model_name,
            "description": self.description,
            "project_name": self.project_name,
        }
        # Visualize model architecture
        plot_file_path = "model_plot.png"
        ModelVisualizer().visualize_model(model, plot_file_path)

        # Save model to a temporary file
        with NamedTemporaryFile(
            prefix="model_", suffix=".keras", delete=False
        ) as temp_model_file:
            model_file_path = temp_model_file.name
            model.save(model_file_path)

        # Prepare files for the request
        files = {
            "file_arc": (Path(model_file_path).name, open(model_file_path, "rb")),
            "file_plot": (plot_file_path, open(plot_file_path, "rb")),
        }

        # Prepare headers and data for logging
        request_headers = {"Content-Type": "multipart/form-data"}
        request_body = {"json": json.dumps(metrics_dict)}

        # Save the request headers and body to a JSON file
        request_data = {"headers": request_headers, "body": request_body}
        with open("request_data.json", "w") as json_file:
            json.dump(request_data, json_file, indent=4)

        # Send request
        try:

            response = requests.post(
                endpoint_url, files=files, data={"json": json.dumps(metrics_dict)}
            )
            response.raise_for_status()
            print(f"Successfully uploaded data: {response.json()}")
        except Exception as e:
            print(f"Error uploading data: {e}")
        finally:
            # Clean up temporary files
            for file in files.values():
                file[1].close()
            unlink(model_file_path)
            unlink(plot_file_path)

    def finalize(self, model):
        self.collect_and_send_data(
            model, "http://127.0.0.1:5000/package/model/data/create"
        )
        print("All is done. Model Created")
