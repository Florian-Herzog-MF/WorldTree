import os
import requests
import json

class EmbeddingClient:
    def __init__(self):
        self._api_endpoint = os.getenv("ADA002_API_ENDPOINT")
        self._api_key = os.getenv("ADA002_API_KEY")

        if not self._api_key:
            raise ValueError("ADA002_API_KEY not found")
        
        if not self._api_endpoint:
            raise ValueError("ADA002_API_ENDPOINT not found")

        self._headers = {
            "api-key": self._api_key,
            "Content-Type": "application/json"
        }
    
    def embedd_query(self, query):

        # Make HTTP Rest POST request
        response = requests.post(self._api_endpoint, headers=self._headers, data=json.dumps({ "input": query }))

        if not response.status_code == 200:
            print("Status Code:", response.status_code)
            return ""
            
        return response.json().get("data")[0].get("embedding")