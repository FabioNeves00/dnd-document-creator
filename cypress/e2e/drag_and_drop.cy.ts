/// <reference types="cypress" />

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
