import os
import requests
import json

class LLMClient:
    def __init__(self):
        self._api_endpoint = os.getenv("GPT_4O_API_ENDPOINT")
        self._api_key = os.getenv("GPT_4O_API_KEY")

        if not self._api_key:
            raise ValueError("GPT_4O_API_KEY not found")
        
        if not self._api_endpoint:
            raise ValueError("GPT_4O_API_ENDPOINT not found")

        self._headers = {
            "api-key": self._api_key,
            "Content-Type": "application/json"
        }
    
    def generate_response(self, user_query: str, system_query: str):
        """response_type: text, json_object"""
        new_message = [
            {
                "role": "system",
                "content": system_query
            },
            {
                "role": "user",
                "content": user_query
            }]

        # Make HTTP Rest POST request
        response = requests.post(self._api_endpoint, headers=self._headers, data=json.dumps({ "messages": new_message }))

        if not response.status_code == 200:
            print("Status Code:", response.status_code)
            return ""
            
        responseBody = response.json()
        responseMessage = responseBody.get("choices")[0].get("message").get("content")

        return responseMessage