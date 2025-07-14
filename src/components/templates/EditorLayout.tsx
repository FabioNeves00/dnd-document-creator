import React from "react";

interface EditorLayoutProps {
  sidebar: React.ReactNode;
  canvas: React.ReactNode;
  propertyPanel: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  sidebar,
  canvas,
  propertyPanel,
}) => (
  <div className="flex h-screen w-screen bg-[#181c23]">
    <aside className="w-64 min-w-[200px] max-w-[320px] p-4 border-r border-[#232a36] bg-[#1a202c] flex-shrink-0">
      {sidebar}
    </aside>
    <main className="flex-1 flex flex-col items-center justify-center overflow-auto p-8">
      {canvas}
    </main>
    <aside className="w-80 min-w-[220px] max-w-[340px] p-4 border-l border-[#232a36] bg-[#1a202c] flex-shrink-0">
      {propertyPanel}
    </aside>
  </div>
);

export default EditorLayout;
