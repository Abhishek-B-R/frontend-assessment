import { DraggableNode } from './draggable-node';

export const PipelineToolbar = () => {
  return (
    <div className="p-4 bg-gray-50 border-b">
      <h2 className="text-lg font-semibold mb-3">Pipeline Components</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Original Nodes */}
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        
        {/* New Custom Nodes */}
        <DraggableNode type="api" label="API Call" />
        <DraggableNode type="filter" label="Filter" />
        <DraggableNode type="transform" label="Transform Text" />
        <DraggableNode type="delay" label="Delay" />
        <DraggableNode type="webhook" label="Webhook" />
        <DraggableNode type="variable" label="Variable" />
        <DraggableNode type="math" label="Math" />
      </div>
    </div>
  );
};
