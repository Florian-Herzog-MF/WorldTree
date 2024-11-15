
import os
from qdrant_client.models import PointStruct
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

from src.embedding_client import EmbeddingClient
from src.entry_type import EntryType


class VectorDBClient:
    def __init__(self, collection_name: str):
        self._collection_name = collection_name
        self._emb_client = EmbeddingClient()
        self._qdrant_client = QdrantClient(location=os.getenv("QDRANT_HOST"), port=os.getenv("QDRANT_PORT"))

        emb_dim = self._emb_client.find_emb_dim()
        if not self._qdrant_client.collection_exists(self._collection_name):
            self._qdrant_client.create_collection(
                collection_name=self._collection_name,
                vectors_config=VectorParams(size=emb_dim, distance=Distance.COSINE),
            )
        else:
            collection_emb_dim = self._qdrant_client.get_collection(self._collection_name).config.params.vectors.size
            if collection_emb_dim != emb_dim:
                raise RuntimeError("Qdrant DB and embedding model vector size missmatch!")
    
    @property
    def collection_name(self):
        return self._collection_name
    
    def _get_next_id(self):
        points = self._qdrant_client.scroll(
            collection_name=self._collection_name,
            limit=10000, # Never enter more than 10000 elements into the db xD
            with_payload=True)[0]
        if points:
            max_id = max(point.id for point in points)
            print(f"Next Point: {max_id + 1}")
            return max_id + 1
        print("Next Point Id: 1")
        return 1
    
    def scroll(self, skip: int=0, amount=5, type: EntryType=None):
        #TODO: Add type filtering
        self._qdrant_client.scroll(self._collection_name, offset=skip, limit=amount)

    def add_point(self, query: str, payload: dict):
        emb_vec = self._emb_client.embedd_query(query)
        idx = self._get_next_id()
        self._qdrant_client.upsert(
            collection_name=self._collection_name,
            points=[
                PointStruct(
                    id=idx,
                    vector=emb_vec,
                    payload=payload
                )
            ]
        )
    
    def query_search(self, query: str, return_limit: int=3):
        emb_vec = self._emb_client.embedd_query(query)
        search_result = self._qdrant_client.query_points(
            collection_name=self._collection_name,
            query=emb_vec,
            with_payload=True,
            limit=return_limit
        ).points

        return search_result
    
    def search_by_id(self, point_id: str):
        point = self._qdrant_client.retrieve(
            collection_name=self._collection_name,
            ids=[point_id]
        )
        return point
    
    def reset_collection(self):
        emb_dim = self._emb_client.find_emb_dim()
        self._qdrant_client.delete_collection(self._collection_name)
        self._qdrant_client.create_collection(
            collection_name=self._collection_name,
            vectors_config=VectorParams(size=emb_dim, distance=Distance.COSINE))