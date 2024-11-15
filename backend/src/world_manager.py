from src.vector_db_client import VectorDBClient
from src.llm_client import LLMClient
from src.entry_type import EntryType
from src.llm_prompts import WO_GEN_SYSTEM_PROMPT

class WorldManager:
    def __init__(self, project_name: str):
        self._world_object_db = VectorDBClient(f"{project_name}_world_object_collection")
        self._source_db = VectorDBClient(f"{project_name}_source_collection")
        self._assoc_db = VectorDBClient(f"{project_name}_assoc_collection")

        self._llm_client = LLMClient()
    
    def world_object_search(self, prompt: str, type: EntryType=EntryType.NONE, amount: int=5):
        #TODO: Add type filter
        return self._world_object_db.query_search(prompt, amount)
    
    def get_world_object_by_id(self, id: int):
        return self._world_object_db.search_by_id(id)
    
    def get_source_by_id(self, id: int):
        return self._source_db.search_by_id(id)
    
    def get_world_object_page(self, skip: int=0, amount=5, type: EntryType=None):
        return self._world_object_db.scroll(skip, amount, type)
    
    def add_world_object(self):
        self._world_object_db

    def reset_dbs(self):
        self._world_object_db.reset_collection()
        self._source_db.reset_collection()
        self._assoc_db.reset_collection()
    
    def generate_world_object(self, prompt: str, wo_ids: list[int]):
        sys_prompt = WO_GEN_SYSTEM_PROMPT.format({"context": ""})
        self._llm_client.generate_response(prompt, sys_prompt)