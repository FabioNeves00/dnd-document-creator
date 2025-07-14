/// <reference types="cypress" />

describe("Drag and Drop de Componentes", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve arrastar uma caixa de texto da sidebar para o canvas", () => {
    cy.get("[data-cy=sidebar-textbox]").trigger("dragstart");
    cy.get("[data-cy=canvas]").trigger("drop");
    cy.get("[data-cy=canvas] [data-cy=canvas-textbox]").should("exist");
  });

  it("deve selecionar o componente adicionado no canvas", () => {
    cy.get("[data-cy=sidebar-textbox]").trigger("dragstart");
    cy.get("[data-cy=canvas]").trigger("drop");
    cy.get("[data-cy=canvas-textbox]").click();
    cy.get("[data-cy=canvas-textbox]").should("have.class", "selected");
  });
});
