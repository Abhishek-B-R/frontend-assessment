import { PipelineToolbar } from './components/toolbar'
import { PipelineUI } from './components/ui'
import { SubmitButton } from './components/submit'
import { Header } from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col h-screen pt-16">
        <PipelineToolbar />
        <div className="flex-1 overflow-hidden">
          <PipelineUI />
        </div>
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <SubmitButton />
        </div>
      </div>
    </div>
  )
}

export default App