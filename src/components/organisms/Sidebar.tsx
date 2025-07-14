import React from "react";
import GroupTitle from "../atoms/GroupTitle";
import type { SidebarItem, Component } from "../../types";

interface SidebarProps {
  components: SidebarItem[];
  groupOrder: { name: string; icon: React.ReactNode }[];
  onDragStart: (type: Component["type"]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  components,
  groupOrder,
  onDragStart,
}) => (
  <div className="bg-[#232a36] border border-[#2d3646] rounded-xl p-4 flex flex-col gap-4 h-full">
    <h2 className="text-lg font-bold mb-2 text-gray-200">Componentes</h2>
    <div className="flex-1 flex flex-col gap-4">
      {groupOrder.map(({ name, icon }) => (
        <div key={name}>
          <GroupTitle icon={icon}>
            <span className="text-gray-300">{name}</span>
          </GroupTitle>
          <div className="flex gap-2 flex-wrap">
            {components
              .filter((c) => c.group === name)
              .map((c) => (
                <div
                  key={c.type}
                  data-cy={c.dataCy}
                  className="w-12 h-12 border border-[#2d3646] rounded bg-[#232a36] text-gray-200 flex items-center justify-center cursor-grab hover:bg-[#2d3646] transition"
                  draggable
                  onDragStart={() => onDragStart(c.type)}
                  tabIndex={0}
                  aria-label={c.label}
                >
                  <span className="text-xs text-gray-200 text-center leading-tight select-none">
                    {c.label}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;
