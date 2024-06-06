import json
from tensorflow.keras.callbacks import Callback
from os import unlink
from tempfile import NamedTemporaryFile
from ..utils.UploadToEndpoints import upload_to_endpoint
from pathlib import Path


class MetricsCollector(Callback):
    """
    A callback class for collecting and exporting model training metrics to a JSON file.

    Usage:
    Instantiate the class and use it as a callback during model training to collect metrics after each epoch.
    Call the `export_to_json` method to export the collected metrics to a JSON file.
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
    metrics_collector.export_to_json("metrics.json")
    ```

    Attributes:
        None

    Methods:
        export_to_json(filename="results.json"):
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
            "training_loss": self.losses,
            "training_accuracy": self.accuracies,
            "validation_loss": self.val_losses,
            "validation_accuracy": self.val_accuracies,
            **self.additional_metrics,  # Include additional metrics
        }
        return metrics_dict

    def export_to_json(self, filename="results.json"):
        """
        Exports the collected training metrics to a JSON file.

        :param str filename: The filename to save the JSON file. (Default: "results.json")
        """
        metrics_dict = {
            "training_loss": self.losses,
            "training_accuracy": self.accuracies,
            "validation_loss": self.val_losses,
            "validation_accuracy": self.val_accuracies,
            **self.additional_metrics,  # Include additional metrics
        }
        try:
            upload_to_endpoint(
                "modelFile",
                metrics_dict,
                "http://localhost:3000/ModelData/trainingData",
            )
        except Exception as e:
            print(f"Error uploading file (export_to_json): {e}")

    def upload_model(self, model):
        """
        Save the Keras model to a temporary .keras file and upload it to the specified endpoint.

        :param model: The Keras model to save and upload.
        :param str endpoint_url: The URL of the endpoint to upload the model to.
        """
        # Create a temporary file
        with NamedTemporaryFile(
            prefix="model_", suffix=".keras", delete=True
        ) as temp_file:
            temp_file_path = temp_file.name
            filename = Path(temp_file_path).name
        try:
            # Save the model to the temporary .h5 file
            model.save(temp_file_path)
            upload_to_endpoint(
                "modeFile",
                temp_file_path,
                "http://localhost:3000/ModelData/hd5",
                filename,
            )
        except Exception as e:
            print(f"Error uploading file (upload_model): {e}")
        finally:
            # Ensure the temporary file is deleted after use
            try:
                unlink(temp_file_path)
            except Exception as e:
                print(f"Error deleting temporary file (upload_model): {e}")


# Imports for ModelVisualizer
from keras.utils import plot_model


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
    def visualize_model(model, plot_filename="result.png"):
        """
        Generates a visualization of the architecture of a Keras model and saves it to a file.

        Parameters:
            model (tensorflow.keras.Model): The Keras model to visualize.
            plot_filename (str): The filename to save the plot.

        Raises:
            ValueError: If the provided model is not a Keras model instance.
        """
        try:
            # Check that the plot is working
            # plot_model(
            #     model, to_file=plot_filename, show_shapes=True, show_layer_names=True
            # )
            upload_to_endpoint(
                "modelPlot", plot_filename, "http://localhost:3000/ModelData/plot"
            )
        except Exception as e:
            print(f"Error uploading file (visualize_model): {e}")


class ExperimentInitializer:
    def __init__(self):
        """
        Initialize the experiment tracking run/model with the given configuration.

        """
        self.MetricsCollectorExperiment = MetricsCollector()

    def _validate_config(self):
        """Validate the configuration parameters."""
        if not self.run_name:
            raise ValueError("Run name is required.")
        if not self.project_name:
            raise ValueError("Project name is required.")
        if not self.api_token:
            raise ValueError("API token is required.")
        if not self.model_name:
            raise ValueError("Model name is required.")

    def init_run(self, config):
        """Initialize the run with the given configuration:

        Parameters:
        config (dict): A dictionary containing configuration parameters:
            - run_name (str): The name of the run.
            - project_name (str): The name of the project.
            - api_token (str): The API token for authentication.
            - model_name (str): The name of the model.

        """
        self.run_name = config.get("run_name")
        self.project_name = config.get("project_name")
        self.api_token = config.get("api_token")
        self.model_name = config.get("model_name")

        self._validate_config()
        # Placeholder for any initialization logic
        # API Requests, etc.
        print(
            f"Initializing run '{self.run_name}' for project '{self.project_name}' with model '{self.model_name}'."
        )

    def init_model(self, config):
        """Initialize the model with the given configuration:

        Parameters:
        config (dict): A dictionary containing configuration parameters:
            - run_name (str): The name of the run.
            - project_name (str): The name of the project.
            - api_token (str): The API token for authentication.
            - model_name (str): The name of the model.

        """
        self.run_name = config.get("run_name")
        self.project_name = config.get("project_name")
        self.api_token = config.get("api_token")
        self.model_name = config.get("model_name")

        self._validate_config()
        # Placeholder for any initialization logic
        # API Requests, etc.
        print(
            f"Initializing run '{self.run_name}' for project '{self.project_name}' with model '{self.model_name}'."
        )

    def MetricsCollector(self):
        return self.MetricsCollectorExperiment

    def ModelVisualizer(self):
        self.ModelVisualizer = ModelVisualizer()
        return self.ModelVisualizer

    # def authenticate_with_api(self, api_token):
    #     """
    #     Authenticate with the experiment tracking API using the provided token.

    #     Parameters:
    #     api_token (str): The API token for authentication.
    #     """
    #     # Placeholder for API authentication logic
    #     print(f"Authenticating with API using token '{api_token}'")

    # def setup_directories(self):
    #     """
    #     Set up directories for storing model checkpoints and metrics.
    #     """
    #     # Placeholder for directory setup logic
    #     print("Setting up directories for model checkpoints and metrics.")
