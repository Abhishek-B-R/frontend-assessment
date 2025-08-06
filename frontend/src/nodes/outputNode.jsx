import { useState, useCallback } from 'react'
import { Handle, Position } from 'reactflow'
import { FileOutput, Settings } from 'lucide-react'
import { useStore } from '../store'

export const OutputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'))
  const [outputType, setOutputType] = useState(data.outputType || 'Text')
  const updateNodeField = useStore((state) => state.updateNodeField)

  const handleNameChange = useCallback((e) => {
    const newName = e.target.value
    setCurrName(newName)
    updateNodeField(id, 'outputName', newName)
  }, [id, updateNodeField])

  const handleTypeChange = useCallback((e) => {
    const newType = e.target.value
    setOutputType(newType)
    updateNodeField(id, 'outputType', newType)
  }, [id, updateNodeField])

  return (
    <div className={`bg-white rounded-lg shadow-soft border-2 transition-all duration-200 ${
      selected ? 'border-primary-500 shadow-medium' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-value`}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ left: -6 }}
      />

      {/* Header */}
      <div className="flex items-center space-x-2 px-4 py-3 bg-green-50 rounded-t-lg border-b border-gray-100">
        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
          <FileOutput className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-gray-900 text-sm">Output Node</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Variable Name
          </label>
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange}
            className="node-input"
            placeholder="Enter variable name"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Output Type
          </label>
          <select value={outputType} onChange={handleTypeChange} className="node-select">
            <option value="Text">Text</option>
            <option value="Image">Image</option>
            <option value="File">File</option>
            <option value="JSON">JSON</option>
          </select>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Settings className="w-3 h-3" />
            <span>ID: {id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}