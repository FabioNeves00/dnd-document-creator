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
    handleResizeComponent,
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
    await exportCanvasToPDF(canvasComponents);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-1">
        <EditorLayout
          sidebar={
            <Sidebar
              components={COMPONENTS}
              groupOrder={groupOrder}
              onDragStart={handleDragStart}
              onExportJSON={handleExportJSON}
              onExportPDF={handleExportPDF}
            />
          }
          canvas={
            <Canvas
              components={canvasComponents}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onSelect={handleSelect}
              onMove={handleMoveComponent}
              onResize={handleResizeComponent}
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
