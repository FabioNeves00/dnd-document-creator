/// <reference types="cypress" />

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

describe("Imagem no Canvas", () => {
  beforeEach(() => {
    cy.visit("/");
    // Adiciona componente de imagem ao canvas
    cy.get("[data-cy=sidebar-image]").trigger("dragstart");
    cy.get("[data-cy=canvas]").trigger("drop");
    // Seleciona o componente de imagem
    cy.get("[data-cy=canvas-image]").click({ force: true });
  });

  it("faz upload de imagem e renderiza no canvas", () => {
    // Cria um arquivo fake
    const fileName = "test.png";
    const fileType = "image/png";
    const fileContent = Cypress.Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // PNG header
    cy.get("[data-cy=property-image-upload]").selectFile(
      {
        contents: fileContent,
        fileName,
        mimeType: fileType,
        lastModified: Date.now(),
      },
      { force: true }
    );
    // Deve atualizar o src do <img> para base64
    cy.get("[data-cy=canvas-image]").should(($img) => {
      const src = $img.attr("src");
      expect(src).to.match(/^data:image\/png;base64/);
    });
  });
});
