export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event) => {
    const nodeData = { nodeType: type };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="cursor-grab active:cursor-grabbing min-w-20 h-15 flex items-center justify-center rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition-colors px-4 py-3"
      onDragStart={onDragStart}
      draggable
    >
      {label}
    </div>
  );
};
