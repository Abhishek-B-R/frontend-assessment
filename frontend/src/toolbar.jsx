import {
  Database,
  Cpu,
  SquareTerminal,
  Type,
  Globe,
  Filter,
  Repeat,
  Timer,
  Webhook as WebhookIcon,
  Variable as VariableIcon,
  Calculator,
  StickyNote
} from "lucide-react";
import { DraggableNode } from "./draggable-node";
import { SubmitButton } from "./submit";

export const PipelineToolbar = () => {
  // const [expanded, setExpanded] = useState(false)
  const expanded=true

  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     if (e.clientY < 100) {
  //       setExpanded(true);
  //     } else {
  //       setExpanded(false);
  //     }
  //   };
  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);

  const toolbarItems = [
    { type: "customInput", label: "Input", icon: Database },
    { type: "llm", label: "LLM", icon: Cpu },
    { type: "customOutput", label: "Output", icon: SquareTerminal },
    { type: "text", label: "Text", icon: Type },
    { type: "api", label: "API Call", icon: Globe },
    { type: "filter", label: "Filter", icon: Filter },
    { type: "transform", label: "Transform Text", icon: Repeat },
    { type: "delay", label: "Delay", icon: Timer },
    { type: "webhook", label: "Webhook", icon: WebhookIcon },
    { type: "variable", label: "Variable", icon: VariableIcon },
    { type: "math", label: "Math", icon: Calculator },
    { type: "note", label: "Note", icon: StickyNote }
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 transition-all duration-300 border-b z-50 ${
        expanded
          ? "bg-[#e4e5e7] h-24 shadow-md"
          : "bg-[#e4e5e7]/95 h-18"
      }`}
    >
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-x-auto">
          {toolbarItems.map((item) => (
            <DraggableNode
              key={item.type}
              type={item.type}
              label={expanded ? item.label : ""}
              icon={item.icon}
              expanded={expanded}
            />
          ))}
        </div>

        <SubmitButton />
      </div>
    </div>
  );
};
