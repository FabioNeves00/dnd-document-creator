import React from "react";
import GroupTitle from "../atoms/GroupTitle";
import Button from "../atoms/Button";
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import type { SidebarItem, Component } from "../../types";

interface SidebarProps {
  components: SidebarItem[];
  groupOrder: { name: string; icon: React.ReactNode }[];
  onDragStart: (type: Component["type"]) => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  components,
  groupOrder,
  onDragStart,
  onExportJSON,
  onExportPDF,
}) => (
  <div
    className="bg-[#232a36] border border-[#2d3646] rounded-xl p-4 flex flex-col gap-4 h-full"
    data-cy="components-sidebar"
  >
    <h2 className="text-lg font-bold mb-2 text-gray-200">Componentes</h2>
    <div className="flex-1 flex flex-col gap-4">
      {groupOrder.map(({ name, icon }) => (
        <div
          key={name}
          data-cy={`sidebar-group-${name.toLowerCase().replace(/\s+/g, "-")}`}
        >
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

    {/* Botões de Exportação */}
    <div className="border-t border-[#2d3646] pt-4 mt-4">
      <h3 className="text-sm font-semibold mb-3 text-gray-300">Exportar</h3>
      <div className="flex flex-col gap-2">
        <Button
          data-cy="export-json"
          icon={<DocumentTextIcon className="w-4 h-4" aria-hidden="true" />}
          onClick={onExportJSON}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 w-full justify-center"
          aria-label="Exportar como JSON"
        >
          Exportar JSON
        </Button>
        <Button
          data-cy="export-pdf"
          icon={
            <DocumentArrowDownIcon className="w-4 h-4" aria-hidden="true" />
          }
          onClick={onExportPDF}
          className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 w-full justify-center"
          aria-label="Exportar como PDF"
        >
          Exportar PDF
        </Button>
      </div>
    </div>
  </div>
);

export default Sidebar;
