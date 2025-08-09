import { useStore } from './store';

export const SubmitButton = () => {
  const { nodes, edges } = useStore();

  const handleSubmit = async () => {
    const pipeline = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position || {},
        data: node.data || {}
      })),
      edges: edges.map(edge => ({
        id: edge.id || `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      }))
    };

    try {
      const resp = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pipeline)
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Server error ${resp.status}: ${txt}`);
      }
      const json = await resp.json();
      alert(`Pipeline parsed:\n• Nodes: ${json.num_nodes}\n• Edges: ${json.num_edges}\n• Is DAG: ${json.is_dag ? 'Yes' : 'No'}`);
    } catch (err) {
      console.error(err);
      alert(`Failed to submit pipeline: ${err.message}`);
    }
  };

  return (
    <div className="p-4 flex justify-center">
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Submit Pipeline
      </button>
    </div>
  );
};
