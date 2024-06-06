import requests


def upload_to_endpoint(filetype, data, endpoint_url, filename=None):
    """
    Upload data to the specified endpoint URL.

    :param data: The data to upload. It can be a file (in binary mode) or a JSON object.
    :param str endpoint_url: The URL of the endpoint to upload the data to.
    :return: The response from the endpoint.
    """
    if isinstance(data, dict):  # If data is JSON
        headers = {"Content-Type": "application/json"}
        response = requests.post(endpoint_url, json=data, headers=headers)
    else:  # If data is a file
        modelFile = {filetype: (filename, open(data, "rb"), "multipart/form-data")}
        response = requests.post(endpoint_url, files=modelFile)
    return response
