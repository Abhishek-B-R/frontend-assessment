from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict

app = FastAPI()

# Allow dev origins (adjust if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NodeModel(BaseModel):
    id: str
    type: str
    position: Dict[str, Any] = {}
    data: Dict[str, Any] = {}

class EdgeModel(BaseModel):
    id: str = None
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None

class PipelineModel(BaseModel):
    nodes: List[NodeModel]
    edges: List[EdgeModel]

def is_dag(nodes, edges):
    node_ids = {n.id for n in nodes}
    indeg = {nid: 0 for nid in node_ids}
    adj = {nid: [] for nid in node_ids}

    for e in edges:
        if e.source in node_ids and e.target in node_ids:
            adj[e.source].append(e.target)
            indeg[e.target] += 1

    queue = [n for n in node_ids if indeg[n] == 0]
    visited = 0
    while queue:
        cur = queue.pop(0)
        visited += 1
        for nb in adj[cur]:
            indeg[nb] -= 1
            if indeg[nb] == 0:
                queue.append(nb)
    return visited == len(node_ids)

@app.post("/pipelines/parse")
def parse_pipeline(pipeline: PipelineModel):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)
    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": dag}
