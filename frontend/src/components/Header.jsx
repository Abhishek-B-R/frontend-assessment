import { Workflow, Zap } from 'lucide-react'

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
              <Workflow className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Pipeline Builder</h1>
              <p className="text-sm text-gray-500">Create and manage your data pipelines</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}