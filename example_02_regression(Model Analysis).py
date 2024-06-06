import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split

from experiment_tracker import ExperimentInitializer

# Generate dummy data
X = np.random.rand(1000, 10)
y = np.random.randint(2, size=(1000,))

# Split data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the model
model = Sequential(
    [Dense(64, activation="relu", input_shape=(10,)), Dense(1, activation="sigmoid")]
)

# Compile the model
model.compile(optimizer=Adam(), loss="binary_crossentropy", metrics=["accuracy"])

experiment = ExperimentInitializer()
run = experiment.init_run(
    config={
        "run_name": "RUN-10",
        "project_name": "example_01_regression",
        "api_token": "ouwegfbwon32908ufni12h08eh1",
        "model_name": "face_recognition_model",
        "endpoint": "https://your-endpoint-url.com/upload",
    }
)


# Create an instance of MetricsCollector
metriccollector = experiment.MetricsCollector()

# Train the model
history = model.fit(
    X_train,
    y_train,
    epochs=10,
    batch_size=32,
    validation_data=(X_val, y_val),
    callbacks=[metriccollector],
)

# Add custom metrics to the collector
metriccollector["test"] = "haha"

# Print the collected metrics
print(metriccollector.print_metrics())


# Export the collected metrics to a JSON file and send it to the endpoint
metriccollector.export_to_json("result.json")


# Visualize the model
experiment.ModelVisualizer().visualize_model(model, "model.png")


# Upload the model to the endpoint
metriccollector.upload_model(model)
