import { useState, useCallback } from 'react'
import { Handle, Position } from 'reactflow'
import { Type, Settings } from 'lucide-react'
import { useStore } from '../store'

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}')
  const updateNodeField = useStore((state) => state.updateNodeField)

  const handleTextChange = useCallback((e) => {
    const newText = e.target.value
    setCurrText(newText)
    updateNodeField(id, 'text', newText)
  }, [id, updateNodeField])

  return (
    <div className={`bg-white rounded-lg shadow-soft border-2 transition-all duration-200 ${
      selected ? 'border-primary-500 shadow-medium' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Header */}
      <div className="flex items-center space-x-2 px-4 py-3 bg-orange-50 rounded-t-lg border-b border-gray-100">
        <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
          <Type className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-gray-900 text-sm">Text Node</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea 
            value={currText} 
            onChange={handleTextChange}
            className="node-input resize-none"
            rows={3}
            placeholder="Enter text content or use {{variables}}"
          />
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Settings className="w-3 h-3" />
              <span>ID: {id}</span>
            </div>
            <div className="text-xs text-gray-400">
              {currText.length} chars
            </div>
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
        style={{ right: -6 }}
      />
    </div>
  )
}