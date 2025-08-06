import { DraggableNode } from './draggableNode'
import { Database, MessageSquare, FileOutput, Type } from 'lucide-react'

export const PipelineToolbar = () => {
  const nodeTypes = [
    { type: 'customInput', label: 'Input', icon: Database, color: 'bg-blue-500' },
    { type: 'llm', label: 'LLM', icon: MessageSquare, color: 'bg-purple-500' },
    { type: 'customOutput', label: 'Output', icon: FileOutput, color: 'bg-green-500' },
    { type: 'text', label: 'Text', icon: Type, color: 'bg-orange-500' },
  ]

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Node Library
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Drag and drop nodes to build your pipeline
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {nodeTypes.map(({ type, label, icon: Icon, color }) => (
          <DraggableNode 
            key={type}
            type={type} 
            label={label} 
            icon={Icon}
            color={color}
          />
        ))}
      </div>
    </div>
  )
}