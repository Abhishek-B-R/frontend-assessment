export const DraggableNode = ({ type, label, icon: Icon, color }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType }
    event.target.style.cursor = 'grabbing'
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className="draggable-node group"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      <div className="flex flex-col items-center space-y-1">
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs font-medium text-gray-700">{label}</span>
      </div>
    </div>
  )
}