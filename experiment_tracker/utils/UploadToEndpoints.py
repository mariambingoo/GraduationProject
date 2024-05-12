import requests


def upload_to_endpoint(data, endpoint_url):
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
        files = {"file": data}
        response = requests.post(endpoint_url, files=files)
    return response
