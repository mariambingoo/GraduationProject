import os
import json
import hashlib
from pathlib import Path
from datetime import datetime


class DatasetVersioning:
    """
    A class to track and version the metadata of a dataset.

    Methods:
        generate_metadata(path, output_filename):
            Generates a JSON file with metadata for each file in the specified directory and its subdirectories.
    """

    def __init__(self, path):
        self.path = path

    def get_file_metadata(self, file_path):
        """
        Get metadata for a specific file.

        :param str file_path: The path to the file.
        :return: A dictionary containing metadata for the file.
        :rtype: dict
        """
        script_dir = os.dirname(os.abspath(__file__))
        file_path = os.join(script_dir, file_path)
        stat_info = os.stat(file_path)
        metadata = {
            "file_name": Path(file_path).name,
            "file_size": stat_info.st_size,
            "creation_time": self.format_time(stat_info.st_ctime),
            "modification_time": self.format_time(stat_info.st_mtime),
            "file_hash": self.get_file_hash(file_path),
        }
        return metadata

    def get_file_hash(self, file_path):
        """
        Get the SHA-256 hash of a file.

        :param str file_path: The path to the file.
        :return: The SHA-256 hash of the file.
        :rtype: str
        """
        hasher = hashlib.sha256()
        with open(file_path, "rb") as f:
            buf = f.read()
            hasher.update(buf)
        return hasher.hexdigest()

    def format_time(self, timestamp):
        """
        Convert a timestamp to a human-readable format.

        :param float timestamp: The timestamp to convert.
        :return: The formatted time string.
        :rtype: str
        """
        dt_object = datetime.fromtimestamp(timestamp)
        return dt_object.strftime("%Y-%m-%d %H:%M:%S")

    def generate_metadata(self, output_filename="dataset_metadata.json"):
        """
        Generates a JSON file with metadata for each file in the specified directory and its subdirectories.

        :param str output_filename: The filename to save the JSON file. (Default: "dataset_metadata.json")
        """
        metadata = {}
        for root, _, files in os.walk(self.path):
            relative_root = os.path.relpath(root, self.path)
            if relative_root == ".":
                relative_root = ""
            for file in files:
                file_path = os.path.join(root, file)
                file_metadata = self.get_file_metadata(file_path)
                if relative_root not in metadata:
                    metadata[relative_root] = []
                metadata[relative_root].append(file_metadata)

        # with open(output_filename, "w") as f:
        #     json.dump(metadata, f, indent=4)

        print(f"Metadata generated and saved to {output_filename}")

        return metadata
