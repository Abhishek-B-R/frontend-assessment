import { useStore } from './store';

export const SubmitButton = () => {
  const { nodes, edges } = useStore();

  const handleSubmit = () => {
    const pipeline = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      }))
    };
    
    console.log('Pipeline submitted:', pipeline);
    alert(`Pipeline submitted with ${nodes.length} nodes and ${edges.length} connections!`);
  };

  return (
    <div className="p-4 flex justify-center">
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  transition-colors font-medium shadow-sm"
      >
        Submit
      </button>
    </div>
  );
};
