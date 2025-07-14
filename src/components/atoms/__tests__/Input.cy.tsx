/// <reference types="cypress" />

import Input from "../Input";

describe("Input atom", () => {
  it("renderiza e aceita digitação", () => {
    cy.mount(<Input data-cy="input-test" placeholder="Digite aqui" />);
    cy.get("[data-cy=input-test]")
      .should("exist")
      .type("abc")
      .should("have.value", "abc");
  });

  it("aplica alinhamento corretamente", () => {
    cy.mount(<Input data-cy="input-align" align="right" />);
    cy.get("[data-cy=input-align]").should("have.class", "text-right");
  });
});
