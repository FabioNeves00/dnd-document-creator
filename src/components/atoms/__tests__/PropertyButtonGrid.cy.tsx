import PropertyButtonGrid from "../PropertyButtonGrid";
import {
  createTextAlignOptions,
  createVerticalAlignOptions,
} from "../propertyOptions";

describe("PropertyButtonGrid", () => {
  it("renderiza corretamente com opções de alinhamento de texto", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy");

    cy.mount(
      <PropertyButtonGrid
        label="Alinhamento do texto"
        value="left"
        options={createTextAlignOptions()}
        dataCy="text-align-grid"
        onChange={onChangeSpy}
      />
    );

    // Verifica se o label está presente
    cy.contains("Alinhamento do texto").should("be.visible");

    // Verifica se todos os 4 botões estão presentes
    cy.get('[data-cy="text-align-grid"] button').should("have.length", 4);

    // Verifica se o botão "left" está selecionado
    cy.get('[data-cy="text-align-grid-left"]')
      .should("have.class", "bg-blue-600")
      .should("be.visible");
  });

  it("altera o valor quando um botão é clicado", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy");

    cy.mount(
      <PropertyButtonGrid
        label="Alinhamento vertical"
        value="top"
        options={createVerticalAlignOptions()}
        dataCy="vertical-align-grid"
        onChange={onChangeSpy}
      />
    );

    // Clica no botão "middle"
    cy.get('[data-cy="vertical-align-grid-middle"]').click();

    // Verifica se o callback foi chamado com o valor correto
    cy.get("@onChangeSpy").should("have.been.calledWith", "middle");
  });

  it("mostra tooltips nos botões", () => {
    cy.mount(
      <PropertyButtonGrid
        label="Alinhamento vertical"
        value="top"
        options={createVerticalAlignOptions()}
        dataCy="vertical-align-grid"
        onChange={() => {}}
      />
    );

    // Verifica se o tooltip está presente
    cy.get('[data-cy="vertical-align-grid-top"]').should(
      "have.attr",
      "title",
      "Alinhar ao topo"
    );

    cy.get('[data-cy="vertical-align-grid-middle"]').should(
      "have.attr",
      "title",
      "Centralizar verticalmente"
    );
  });

  it("aplica classes corretas para botão selecionado", () => {
    cy.mount(
      <PropertyButtonGrid
        label="Teste"
        value="center"
        options={createTextAlignOptions()}
        dataCy="test-grid"
        onChange={() => {}}
      />
    );

    // Verifica se o botão selecionado tem as classes corretas
    cy.get('[data-cy="test-grid-center"]')
      .should("have.class", "bg-blue-600")
      .should("have.class", "border-blue-500")
      .should("have.class", "text-white");

    // Verifica se o botão não selecionado tem as classes corretas
    cy.get('[data-cy="test-grid-left"]')
      .should("have.class", "bg-[#232a36]")
      .should("have.class", "border-[#2d3646]")
      .should("have.class", "text-gray-300");
  });

  it("mostra indicador visual no botão selecionado", () => {
    cy.mount(
      <PropertyButtonGrid
        label="Teste"
        value="left"
        options={createTextAlignOptions()}
        dataCy="indicator-grid"
        onChange={() => {}}
      />
    );

    // Verifica se o indicador visual está presente no botão selecionado
    cy.get('[data-cy="indicator-grid-left"]')
      .find(".bg-blue-400")
      .should("exist")
      .should("have.class", "w-2")
      .should("have.class", "h-2")
      .should("have.class", "rounded-full");
  });
});
