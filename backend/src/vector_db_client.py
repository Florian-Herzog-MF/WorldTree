
import os
from qdrant_client.models import PointStruct
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

from src.embedding_client import EmbeddingClient
from src.llm_client import LLMClient


class VectorDBClient:
    def __init__(self, collection_name: str):
        self._collection_name = collection_name
        self._emb_client = EmbeddingClient()
        self._llm_client = LLMClient()
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
            raise AssertionError
    
    def add_point(self, query):
        emb_vec = self._emb_client.embedd_query(query)
        
        self._qdrant_client.upsert(
        collection_name=self._collection_name,
        points=[
            PointStruct(
                    id=idx,
                    vector=,
                    payload={"color": "red", "rand_number": idx % 10}
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

        print(search_result)
