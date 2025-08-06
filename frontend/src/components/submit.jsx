import { useStore } from '../store'
import { Play, Download, Save } from 'lucide-react'

export const SubmitButton = () => {
  const { nodes, edges } = useStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
  }))

  const handleSubmit = async () => {
    const pipeline = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        data: node.data,
        position: node.position
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      }))
    }

    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pipeline: JSON.stringify(pipeline) }),
      })
      
      const result = await response.json()
      console.log('Pipeline submitted:', result)
      
      // Show success message
      alert('Pipeline submitted successfully!')
    } catch (error) {
      console.error('Error submitting pipeline:', error)
      alert('Error submitting pipeline. Please try again.')
    }
  }

  const handleSave = () => {
    const pipeline = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        data: node.data,
        position: node.position
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      }))
    }

    const dataStr = JSON.stringify(pipeline, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'pipeline.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const isDisabled = nodes.length === 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-500">
          <span className="font-medium">{nodes.length}</span> nodes, 
          <span className="font-medium ml-1">{edges.length}</span> connections
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={handleSave}
          disabled={isDisabled}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Pipeline
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
        >
          <Play className="w-4 h-4 mr-2" />
          Run Pipeline
        </button>
      </div>
    </div>
  )
}