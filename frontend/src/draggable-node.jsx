// eslint-disable-next-line no-unused-vars
export const DraggableNode = ({ type, label, icon: Icon, expanded }) => {
  const onDragStart = (event) => {
    const nodeData = { nodeType: type };
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = "move";
  };

  const colors = {
    customInput: "bg-blue-700 hover:bg-blue-600",
    llm: "bg-orange-600 hover:bg-orange-500",
    customOutput: "bg-green-700 hover:bg-green-600",
    text: "bg-purple-700 hover:bg-purple-600",
    api: "bg-sky-700 hover:bg-sky-600",
    filter: "bg-rose-700 hover:bg-rose-600",
    transform: "bg-indigo-700 hover:bg-indigo-600",
    delay: "bg-amber-600 hover:bg-amber-500",
    webhook: "bg-pink-700 hover:bg-pink-600",
    variable: "bg-emerald-700 hover:bg-emerald-600",
    math: "bg-yellow-500 hover:bg-yellow-400 text-black",
    note: "bg-slate-600 hover:bg-slate-500"
  };

  return (
    <div
      className={`cursor-grab active:cursor-grabbing flex items-center justify-center rounded-lg text-white text-sm font-medium transition-all duration-200 ${
        colors[type] || "bg-slate-700 hover:bg-slate-600"
      } ${expanded ? "px-4 py-3 min-w-[90px]" : "p-2 w-12 h-12"}`}
      onDragStart={onDragStart}
      draggable
    >
      <Icon size={20} />
      {expanded && <span className="ml-2">{label}</span>}
    </div>
  );
};
