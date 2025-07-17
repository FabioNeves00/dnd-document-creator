/// <reference types="cypress" />

describe("Drag and Drop Editor", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should allow dragging and dropping components", () => {
    // Drag a text component to canvas
    cy.get('[data-cy="sidebar-textarea"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Check if component was added
    cy.get('[data-cy="canvas"]').should("contain", "Clique duplo para editar");
  });

  it("should allow editing signature text", () => {
    // Drag a signature component to canvas
    cy.get('[data-cy="sidebar-signature"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Select the signature component
    cy.get('[data-cy="signature-text"]').click();

    // Check if property panel shows signature section
    cy.get('[data-cy="property-signature-section"]').should("be.visible");

    // Edit the signature text
    cy.get('[data-cy="property-signature-text"]').clear().type("João Silva");

    // Verify the text changed in the canvas
    cy.get('[data-cy="signature-text"]').should("contain", "João Silva");
  });

  it("should allow editing title text", () => {
    // Drag a title component to canvas
    cy.get('[data-cy="sidebar-title"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Select the title component
    cy.get('[data-cy="display-text"]').first().click();

    // Check if property panel shows content section with text input
    cy.get('[data-cy="property-content-section"]').should("be.visible");
    cy.get('[data-cy="property-content-input"]').should("be.visible");

    // Edit the title text
    cy.get('[data-cy="property-content-input"]')
      .clear()
      .type("Meu Título Personalizado");

    // Verify the text changed in the canvas
    cy.get('[data-cy="display-text"]').should(
      "contain",
      "Meu Título Personalizado"
    );
  });

  it("should allow editing subtitle text", () => {
    // Drag a subtitle component to canvas
    cy.get('[data-cy="sidebar-subtitle"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Select the subtitle component
    cy.get('[data-cy="display-text"]').first().click();

    // Check if property panel shows content section
    cy.get('[data-cy="property-content-section"]').should("be.visible");
    cy.get('[data-cy="property-content-input"]').should("be.visible");

    // Edit the subtitle text
    cy.get('[data-cy="property-content-input"]').clear().type("Meu Subtítulo");

    // Verify the text changed in the canvas
    cy.get('[data-cy="display-text"]').should("contain", "Meu Subtítulo");
  });

  it("should allow editing paragraph text", () => {
    // Drag a paragraph component to canvas
    cy.get('[data-cy="sidebar-paragraph"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Select the paragraph component
    cy.get('[data-cy="display-text"]').first().click();

    // Check if property panel shows content section
    cy.get('[data-cy="property-content-section"]').should("be.visible");
    cy.get('[data-cy="property-content-input"]').should("be.visible");

    // Edit the paragraph text
    cy.get('[data-cy="property-content-input"]')
      .clear()
      .type("Este é o meu parágrafo personalizado.");

    // Verify the text changed in the canvas
    cy.get('[data-cy="display-text"]').should(
      "contain",
      "Este é o meu parágrafo personalizado."
    );
  });

  it("should allow customizing signature properties", () => {
    // Drag a signature component to canvas
    cy.get('[data-cy="sidebar-signature"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Select the signature component
    cy.get('[data-cy="signature-text"]').click();

    // Change line width
    cy.get('[data-cy="property-line-width"]').clear().type("300");

    // Change font size
    cy.get('[data-cy="property-signature-font-size"]').clear().type("14");

    // Change to bold
    cy.get('[data-cy="property-signature-font-weight-bold"]').click();

    // Verify changes are applied
    cy.get('[data-cy="signature-line"]').should("have.css", "width", "300px");
    cy.get('[data-cy="signature-text"]').should(
      "have.css",
      "font-size",
      "14px"
    );
    cy.get('[data-cy="signature-text"]').should(
      "have.css",
      "font-weight",
      "700"
    ); // bold
  });

  it("should export PDF with all component types", () => {
    // Add various components to canvas
    cy.get('[data-cy="sidebar-title"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    cy.get('[data-cy="sidebar-subtitle"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    cy.get('[data-cy="sidebar-paragraph"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    cy.get('[data-cy="sidebar-divider"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    cy.get('[data-cy="sidebar-signature"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Export PDF (this will trigger download, can't easily verify file content in Cypress)
    cy.get('[data-cy="export-pdf"]').click();

    // Verify no errors occurred (PDF generation should complete without crashes)
    cy.get('[data-cy="canvas"]').should("be.visible");
  });
});

describe("Drag and Drop de Componentes", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve arrastar uma área de texto da sidebar para o canvas", () => {
    cy.get("[data-cy=sidebar-textarea]").trigger("dragstart");
    cy.get("[data-cy=canvas]").trigger("drop");
    cy.get("[data-cy=canvas] [data-cy=canvas-textarea]").should("exist");
  });

  it("deve selecionar o componente adicionado no canvas", () => {
    cy.get("[data-cy=sidebar-textarea]").trigger("dragstart");
    cy.get("[data-cy=canvas]").trigger("drop");
    cy.get("[data-cy=canvas-textarea]").click();
    cy.get("[data-cy=canvas-textarea]").should("have.class", "selected");
  });

  it("deve arrastar uma imagem da sidebar para o canvas", () => {
    cy.get("[data-cy=sidebar-image]").trigger("dragstart");
    cy.get("[data-cy=canvas]").trigger("drop");
    cy.get("[data-cy=canvas] [data-cy=canvas-image]").should("exist");
  });

  it("deve abrir o painel de propriedades ao selecionar um componente", () => {
    cy.get("[data-cy=sidebar-textarea]").trigger("dragstart");
    cy.get("[data-cy=canvas]").trigger("drop");
    cy.get("[data-cy=canvas-textarea]").click();
    cy.get("[data-cy=property-panel-wrapper]").should("be.visible");
  });

  it("deve editar texto ao duplo clique", () => {
    cy.get("[data-cy=sidebar-textarea]").trigger("dragstart");
    cy.get("[data-cy=canvas]").trigger("drop");
    cy.get("[data-cy=canvas-textarea]").dblclick();
    cy.get("[data-cy=editing-textarea]").should("be.visible");
    cy.get("[data-cy=editing-textarea]").type("Texto de teste");
    cy.get("[data-cy=editing-textarea]").blur();
    cy.get("[data-cy=display-text]").should("contain", "Texto de teste");
  });
});

describe("Propriedades de Formatação de Texto", () => {
  beforeEach(() => {
    cy.visit("/");
    // Adiciona um componente de texto
    cy.get("[data-cy=sidebar-textarea]").trigger("dragstart");
    cy.get("[data-cy=canvas]").trigger("drop");
    cy.get("[data-cy=canvas-textarea]").click();
  });

  it("deve alterar o alinhamento do texto para justificado", () => {
    cy.get("[data-cy=property-text-align]").select("justify");
    cy.get("[data-cy=canvas-textarea]").should("have.class", "text-justify");
  });

  it("deve alterar o peso da fonte para negrito", () => {
    cy.get("[data-cy=property-font-weight]").select("bold");
    cy.get("[data-cy=canvas-textarea]").should("have.class", "font-bold");
  });

  it("deve alterar o estilo da fonte para itálico", () => {
    cy.get("[data-cy=property-font-style]").select("italic");
    cy.get("[data-cy=canvas-textarea]").should("have.class", "italic");
  });

  it("deve adicionar sublinhado ao texto", () => {
    cy.get("[data-cy=property-text-decoration]").select("underline");
    cy.get("[data-cy=canvas-textarea]").should("have.class", "underline");
  });

  it("deve alterar o tamanho da fonte", () => {
    cy.get("[data-cy=property-font-size]").clear().type("24");
    cy.get("[data-cy=display-text]").should("have.css", "font-size", "24px");
  });

  it("deve alterar as cores do texto e fundo", () => {
    cy.get("[data-cy=color-text]").invoke("val", "#ff0000").trigger("change");
    cy.get("[data-cy=color-bg]").invoke("val", "#00ff00").trigger("change");
    cy.get("[data-cy=display-text]").should(
      "have.css",
      "color",
      "rgb(255, 0, 0)"
    );
    cy.get("[data-cy=canvas-textarea]").should(
      "have.css",
      "background-color",
      "rgb(0, 255, 0)"
    );
  });
});
