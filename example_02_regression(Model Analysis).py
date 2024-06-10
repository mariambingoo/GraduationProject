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

# Initialize RunInitializer with configuration
run_config = {
    "project_name": "example_project",
    "model_name": "example_model",
    "description": "Example run with a simple model for binary classification.",
}

experiment = ExperimentInitializer()
model_initializer = experiment.init_model(run_config)
metrics_collector = model_initializer.MetricsCollector()


# Train the model with MetricsCollector as a callback
history = model.fit(
    X_train,
    y_train,
    epochs=10,
    batch_size=32,
    validation_data=(X_val, y_val),
    callbacks=[metrics_collector],
)

# Add custom metrics to the metrics collector
metrics_collector["epochs"] = 10

# Finalize and send data
model_initializer.finalize(model)
