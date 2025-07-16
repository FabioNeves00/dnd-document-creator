import PropertyToggleGrid from "../PropertyToggleGrid";
import { createFontStyleToggles } from "../propertyOptions";

describe("PropertyToggleGrid", () => {
  it("renderiza corretamente com opções de estilo de fonte", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy");

    cy.mount(
      <PropertyToggleGrid
        label="Estilo de fonte"
        values={{
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
        }}
        options={createFontStyleToggles()}
        dataCy="font-style-grid"
        onChange={onChangeSpy}
      />
    );

    // Verifica se o label está presente
    cy.contains("Estilo de fonte").should("be.visible");

    // Verifica se todos os 3 botões estão presentes
    cy.get('[data-cy="font-style-grid"] button').should("have.length", 3);

    // Verifica se todos os botões estão na posição desativada
    cy.get('[data-cy="font-style-grid-fontWeight"]')
      .should("have.class", "bg-[#232a36]")
      .should("have.class", "text-gray-400");

    cy.get('[data-cy="font-style-grid-fontStyle"]')
      .should("have.class", "bg-[#232a36]")
      .should("have.class", "text-gray-400");

    cy.get('[data-cy="font-style-grid-textDecoration"]')
      .should("have.class", "bg-[#232a36]")
      .should("have.class", "text-gray-400");
  });

  it("ativa e desativa toggles corretamente", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy");

    cy.mount(
      <PropertyToggleGrid
        label="Estilo de fonte"
        values={{
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
        }}
        options={createFontStyleToggles()}
        dataCy="font-style-grid"
        onChange={onChangeSpy}
      />
    );

    // Clica no botão de negrito para ativar
    cy.get('[data-cy="font-style-grid-fontWeight"]').click();

    // Verifica se o callback foi chamado com os valores corretos
    cy.get("@onChangeSpy").should("have.been.calledWith", "fontWeight", "bold");
  });

  it("mostra estado ativo corretamente", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy");

    cy.mount(
      <PropertyToggleGrid
        label="Estilo de fonte"
        values={{
          fontWeight: "bold", // Ativo
          fontStyle: "italic", // Ativo
          textDecoration: "none", // Inativo
        }}
        options={createFontStyleToggles()}
        dataCy="font-style-grid"
        onChange={onChangeSpy}
      />
    );

    // Verifica se os botões ativos têm as classes corretas
    cy.get('[data-cy="font-style-grid-fontWeight"]')
      .should("have.class", "bg-blue-600")
      .should("have.class", "border-blue-500")
      .should("have.class", "text-white");

    cy.get('[data-cy="font-style-grid-fontStyle"]')
      .should("have.class", "bg-blue-600")
      .should("have.class", "border-blue-500")
      .should("have.class", "text-white");

    // Verifica se o botão inativo tem as classes corretas
    cy.get('[data-cy="font-style-grid-textDecoration"]')
      .should("have.class", "bg-[#232a36]")
      .should("have.class", "text-gray-400");
  });

  it("mostra indicador visual nos botões ativos", () => {
    cy.mount(
      <PropertyToggleGrid
        label="Estilo de fonte"
        values={{
          fontWeight: "bold",
          fontStyle: "normal",
          textDecoration: "underline",
        }}
        options={createFontStyleToggles()}
        dataCy="font-style-grid"
        onChange={() => {}}
      />
    );

    // Verifica se o indicador visual está presente nos botões ativos
    cy.get('[data-cy="font-style-grid-fontWeight"]')
      .find(".bg-blue-400")
      .should("exist")
      .should("have.class", "animate-pulse");

    cy.get('[data-cy="font-style-grid-textDecoration"]')
      .find(".bg-blue-400")
      .should("exist");

    // Verifica que o botão inativo não tem indicador
    cy.get('[data-cy="font-style-grid-fontStyle"]')
      .find(".bg-blue-400")
      .should("not.exist");
  });

  it("aplica role checkbox e aria-pressed corretamente", () => {
    cy.mount(
      <PropertyToggleGrid
        label="Teste"
        values={{
          fontWeight: "bold",
          fontStyle: "normal",
          textDecoration: "none",
        }}
        options={createFontStyleToggles()}
        dataCy="test-grid"
        onChange={() => {}}
      />
    );

    // Verifica role e aria-pressed para botão ativo
    cy.get('[data-cy="test-grid-fontWeight"]')
      .should("have.attr", "role", "checkbox")
      .should("have.attr", "aria-pressed", "true");

    // Verifica aria-pressed para botão inativo
    cy.get('[data-cy="test-grid-fontStyle"]').should(
      "have.attr",
      "aria-pressed",
      "false"
    );
  });

  it("desativa toggle quando já está ativo", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy");

    cy.mount(
      <PropertyToggleGrid
        label="Estilo de fonte"
        values={{
          fontWeight: "bold", // Já ativo
          fontStyle: "normal",
          textDecoration: "none",
        }}
        options={createFontStyleToggles()}
        dataCy="font-style-grid"
        onChange={onChangeSpy}
      />
    );

    // Clica no botão que já está ativo para desativar
    cy.get('[data-cy="font-style-grid-fontWeight"]').click();

    // Verifica se o callback foi chamado para desativar (normal)
    cy.get("@onChangeSpy").should(
      "have.been.calledWith",
      "fontWeight",
      "normal"
    );
  });
});
