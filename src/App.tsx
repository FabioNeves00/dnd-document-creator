import { COMPONENTS, groupOrder } from "./constants/editor";
import { useCanvasComponents } from "./hooks/useCanvasComponents";
import EditorLayout from "./components/templates/EditorLayout";
import Sidebar from "./components/organisms/Sidebar";
import Canvas from "./components/organisms/Canvas";
import PropertyPanelWrapper from "./components/organisms/PropertyPanelWrapper";
import { exportCanvasToPDF } from "./utils/pdfExportFactory";

const App = () => {
  const {
    canvasComponents,
    selectedComponent,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleSelect,
    handleMoveComponent,
    handlePropChangeComponent,
    handleBringForward,
    handleSendBackward,
    handlePropChange,
    handleRemoveComponent,
  } = useCanvasComponents();

  // Exportar JSON
  const handleExportJSON = () => {
    const json = JSON.stringify(canvasComponents, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documento.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Exportar PDF usando factory
  const handleExportPDF = async () => {
    try {
      await exportCanvasToPDF(canvasComponents);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Erro ao exportar PDF:", err);
      alert("Erro ao exportar PDF. Veja o console para detalhes.");
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="w-full flex items-center justify-end gap-4 px-8 py-4 bg-[#181c23] border-b border-[#232a36] z-10">
        <button
          data-cy="export-json"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          onClick={handleExportJSON}
        >
          Exportar JSON
        </button>
        <button
          data-cy="export-pdf"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
          onClick={handleExportPDF}
        >
          Exportar PDF
        </button>
      </header>
      <div className="flex-1">
        <EditorLayout
          sidebar={
            <Sidebar
              components={COMPONENTS}
              groupOrder={groupOrder}
              onDragStart={handleDragStart}
            />
          }
          canvas={
            <Canvas
              components={canvasComponents}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onSelect={handleSelect}
              onMove={handleMoveComponent}
              onPropChange={handlePropChangeComponent}
            />
          }
          propertyPanel={
            <PropertyPanelWrapper
              selectedComponent={selectedComponent}
              onPropChange={handlePropChange}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              onRemoveComponent={handleRemoveComponent}
            />
          }
        />
      </div>
    </div>
  );
};

export default App;
