from src.vector_db_client import VectorDBClient
from src.llm_client import LLMClient
from src.entry_type import EntryType
from src.llm_prompts import WO_GEN_SYSTEM_PROMPT, WO_DISTILL_SYSTEM_PROMPT
import json

class WorldManager:
    def __init__(self, project_name: str):
        self._world_object_db = VectorDBClient(f"{project_name}_world_object_collection")
        self._source_db = VectorDBClient(f"{project_name}_source_collection")
        self._assoc_db = VectorDBClient(f"{project_name}_assoc_collection")

        self._llm_client = LLMClient()
    
    def world_object_search(self, prompt: str, type: EntryType=EntryType.NONE, amount: int=5):
        #TODO: Add type filter
        search_result = self._world_object_db.query_search(prompt, amount)
        return [{"id": entry.id, "score": entry.score} | entry.payload for entry in search_result]

    def source_search(self, prompt: str, amount: int=5):
        return self._source_db.query_search(prompt, amount)
    
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
    
    def generate_world_objects_in_context(self, prompt: str, ref_amount: int=5) -> list[dict]:
        wo_ids = [entry["id"] for entry in self.world_object_search(prompt, amount=ref_amount)]
        return self.generate_world_objects(prompt, wo_ids)
    
    def generate_world_objects(self, prompt: str, wo_ids: list[int]) -> list[dict]:
        source = self.generate_world_object_source(prompt, wo_ids)
        return self.generate_world_objects_from_source(source, wo_ids)

    def generate_world_object_source_in_context(self, prompt: str, ref_amount: int=5) -> dict:
        wo_ids = [entry["id"] for entry in self.world_object_search(prompt, amount=ref_amount)]
        return self.generate_world_object_source(prompt, wo_ids)

    def generate_world_object_source(self, prompt: str, wo_ids: list[int]) -> dict:
        points = self._world_object_db.qdrant_client.retrieve(self._world_object_db.collection_name, wo_ids)
        sys_prompt = WO_GEN_SYSTEM_PROMPT.format(context = str(points))
        return self._llm_client.generate_response(prompt, sys_prompt)

    def generate_world_objects_from_source(self, source: str, wo_ids: list[int]) -> list[dict]:
        points = self._world_object_db.qdrant_client.retrieve(self._world_object_db.collection_name, wo_ids)
        sys_prompt = WO_DISTILL_SYSTEM_PROMPT.format(context = str(points))
        try:
            result = json.loads(self._llm_client.generate_response(source, sys_prompt))
            if type(result) is dict:
                return [result]
            elif type(result) is list:
                return result
        except:
            print("Could not parse.")
        return []
    
    def persist_world_object(self, wo: dict, source_id: int) -> int:
        desc = wo.get("desc")
        if desc:
            wo_id = self._world_object_db.add_point(wo["desc"], wo)
            return self._assoc_db.add_point("-", {"source_id": source_id, "wo_id": wo_id})
        return -1

    def persist_source(self, source: str, desc: str) -> int:
        return self._source_db.add_point(source, {"text": source, "desc": desc})