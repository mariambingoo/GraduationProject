import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split

from experiment_tracker import *

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

# Create an instance of MetricsCollector
metriccollector = MetricsCollector()

# Train the model
history = model.fit(
    X_train,
    y_train,
    epochs=10,
    batch_size=32,
    validation_data=(X_val, y_val),
    callbacks=[metriccollector],
)

# Export the collected metrics to a JSON file and send it to the endpoint
# metriccollector.export_to_json("result.json")

# Upload the model to the endpoint
metriccollector.upload_model(model)

# Visualize the model
# ModelVisualizer.visualize_model(model, "model.png")
