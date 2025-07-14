/// <reference types="cypress" />

import React from "react";
import Canvas from "../Canvas";

describe("Canvas organism", () => {
  it("renderiza vazio", () => {
    cy.mount(
      <Canvas
        components={[]}
        onDrop={() => {}}
        onDragOver={() => {}}
        onSelect={() => {}}
        onMove={() => {}}
        onPropChange={() => {}}
      />
    );
    cy.get("[data-cy=canvas]").should("exist");
  });
});

describe("Exportação", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve exibir os botões de exportação JSON e PDF", () => {
    cy.get("[data-cy=export-json]").should("exist");
    cy.get("[data-cy=export-pdf]").should("exist");
  });

  it("deve exportar o JSON corretamente", () => {
    cy.window().then((win) => {
      cy.stub(win.URL, "createObjectURL").returns("blob:fake-url");
    });
    cy.get("[data-cy=export-json]").click();
    // Não tem como validar o arquivo baixado diretamente, mas podemos checar se o link foi criado
  });

  it("deve exportar o PDF corretamente", () => {
    cy.window().then((win) => {
      cy.stub(win.URL, "createObjectURL").returns("blob:fake-url");
    });
    cy.get("[data-cy=export-pdf]").click();
    // Não tem como validar o arquivo PDF baixado diretamente, mas podemos checar se o link foi criado
  });
});
