import { useState, useCallback } from 'react'
import { Handle, Position } from 'reactflow'
import { MessageSquare, Brain, Settings } from 'lucide-react'
import { useStore } from '../store'

export const LLMNode = ({ id, data, selected }) => {
  const [model, setModel] = useState(data?.model || 'gpt-3.5-turbo')
  const [temperature, setTemperature] = useState(data?.temperature || 0.7)
  const updateNodeField = useStore((state) => state.updateNodeField)

  const handleModelChange = useCallback((e) => {
    const newModel = e.target.value
    setModel(newModel)
    updateNodeField(id, 'model', newModel)
  }, [id, updateNodeField])

  const handleTemperatureChange = useCallback((e) => {
    const newTemp = parseFloat(e.target.value)
    setTemperature(newTemp)
    updateNodeField(id, 'temperature', newTemp)
  }, [id, updateNodeField])

  return (
    <div className={`bg-white rounded-lg shadow-soft border-2 transition-all duration-200 ${
      selected ? 'border-primary-500 shadow-medium' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Input Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-system`}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ left: -6, top: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-prompt`}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ left: -6, top: '70%' }}
      />

      {/* Header */}
      <div className="flex items-center space-x-2 px-4 py-3 bg-purple-50 rounded-t-lg border-b border-gray-100">
        <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
          <Brain className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-gray-900 text-sm">LLM Node</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Model
          </label>
          <select value={model} onChange={handleModelChange} className="node-select">
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3">Claude 3</option>
            <option value="llama-2">Llama 2</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Temperature: {temperature}
          </label>
          <input 
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={handleTemperatureChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Focused</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Settings className="w-3 h-3" />
            <span>ID: {id}</span>
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-response`}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ right: -6 }}
      />

      {/* Handle Labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-around py-12 -ml-16">
        <span className="text-xs text-gray-500 bg-white px-1 rounded">system</span>
        <span className="text-xs text-gray-500 bg-white px-1 rounded">prompt</span>
      </div>
    </div>
  )
}