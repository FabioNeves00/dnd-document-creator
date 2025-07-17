describe("Redimensionamento de Componentes", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("deve permitir redimensionar via painel de propriedades", () => {
    // Adicionar um componente de texto
    cy.get('[data-cy="sidebar-textarea"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Selecionar o componente
    cy.get('[data-cy="canvas-textarea"]').click();

    // Verificar se o painel de propriedades está visível
    cy.get('[data-cy="property-size-section"]').should("be.visible");

    // Alterar largura
    cy.get('[data-cy="property-width"]').clear().type("300");
    cy.get('[data-cy="canvas-textarea"]').should("have.css", "width", "300px");

    // Alterar altura
    cy.get('[data-cy="property-height"]').clear().type("80");
    cy.get('[data-cy="canvas-textarea"]').should("have.css", "height", "80px");
  });

  it("deve mostrar handles de redimensionamento quando selecionado", () => {
    // Adicionar um componente de texto
    cy.get('[data-cy="sidebar-textarea"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Selecionar o componente
    cy.get('[data-cy="canvas-textarea"]').click();

    // Verificar se os handles estão visíveis
    cy.get('[data-cy="resize-handle-top-left"]').should("be.visible");
    cy.get('[data-cy="resize-handle-top-right"]').should("be.visible");
    cy.get('[data-cy="resize-handle-bottom-left"]').should("be.visible");
    cy.get('[data-cy="resize-handle-bottom-right"]').should("be.visible");
    cy.get('[data-cy="resize-handle-top"]').should("be.visible");
    cy.get('[data-cy="resize-handle-bottom"]').should("be.visible");
    cy.get('[data-cy="resize-handle-left"]').should("be.visible");
    cy.get('[data-cy="resize-handle-right"]').should("be.visible");
  });

  it("deve exibir cursores corretos nos handles", () => {
    // Adicionar um componente de texto
    cy.get('[data-cy="sidebar-textarea"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Selecionar o componente
    cy.get('[data-cy="canvas-textarea"]').click();

    // Verificar cursores dos handles
    cy.get('[data-cy="resize-handle-top-left"]').should(
      "have.class",
      "cursor-nw-resize"
    );
    cy.get('[data-cy="resize-handle-top-right"]').should(
      "have.class",
      "cursor-ne-resize"
    );
    cy.get('[data-cy="resize-handle-bottom-left"]').should(
      "have.class",
      "cursor-ne-resize"
    );
    cy.get('[data-cy="resize-handle-bottom-right"]').should(
      "have.class",
      "cursor-nw-resize"
    );
    cy.get('[data-cy="resize-handle-top"]').should(
      "have.class",
      "cursor-ns-resize"
    );
    cy.get('[data-cy="resize-handle-bottom"]').should(
      "have.class",
      "cursor-ns-resize"
    );
    cy.get('[data-cy="resize-handle-left"]').should(
      "have.class",
      "cursor-ew-resize"
    );
    cy.get('[data-cy="resize-handle-right"]').should(
      "have.class",
      "cursor-ew-resize"
    );
  });

  it("deve permitir redimensionar por arrasto dos handles", () => {
    // Adicionar um componente de texto
    cy.get('[data-cy="sidebar-textarea"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Selecionar o componente
    cy.get('[data-cy="canvas-textarea"]').click();

    // Obter tamanho inicial
    cy.get('[data-cy="canvas-textarea"]').then(($el) => {
      const initialWidth = $el.width();

      // Redimensionar usando o handle direito
      cy.get('[data-cy="resize-handle-right"]')
        .trigger("mousedown", { button: 0 })
        .trigger("mousemove", { clientX: 100, clientY: 0 })
        .trigger("mouseup");

      // Verificar se o tamanho mudou
      cy.get('[data-cy="canvas-textarea"]').should(($newEl) => {
        expect($newEl.width()).to.be.greaterThan(initialWidth);
      });
    });
  });

  it("deve mudar o cursor do documento durante redimensionamento", () => {
    // Adicionar um componente de texto
    cy.get('[data-cy="sidebar-textarea"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Selecionar o componente
    cy.get('[data-cy="canvas-textarea"]').click();

    // Verificar que o cursor muda ao fazer mousedown no handle
    cy.get('[data-cy="resize-handle-right"]')
      .trigger("mousedown", { button: 0 })
      .then(() => {
        // Verificar se o cursor do body mudou
        cy.get("body").should("have.css", "cursor").and("include", "resize");
      });

    // Simular mouseup para restaurar cursor
    cy.get('[data-cy="resize-handle-right"]').trigger("mouseup");

    // Verificar se o cursor foi restaurado
    cy.get("body").should("have.css", "cursor", "auto");
  });

  it("deve ajustar o texto quando há mais espaço horizontal", () => {
    // Adicionar um componente de texto com conteúdo longo
    cy.get('[data-cy="sidebar-textarea"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    // Selecionar e editar o componente
    cy.get('[data-cy="canvas-textarea"]').dblclick();
    cy.get('[data-cy="editing-textarea"]')
      .clear()
      .type(
        "Este é um texto muito longo que deveria quebrar linhas automaticamente quando redimensionado"
      );

    // Sair do modo de edição
    cy.get('[data-cy="canvas"]').click();

    // Selecionar novamente
    cy.get('[data-cy="canvas-textarea"]').click();

    // Aumentar a largura
    cy.get('[data-cy="property-width"]').clear().type("400");

    // Verificar se o texto se ajustou (não é fácil testar visualmente, mas podemos verificar se não há erros)
    cy.get('[data-cy="display-text"]').should("be.visible");
    cy.get('[data-cy="canvas-textarea"]').should("have.css", "width", "400px");
  });

  it("deve funcionar com diferentes tipos de componentes", () => {
    // Testar com componente de imagem
    cy.get('[data-cy="sidebar-image"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    cy.get('[data-cy="canvas-image"]').click();
    cy.get('[data-cy="property-width"]').clear().type("250");
    cy.get('[data-cy="property-height"]').clear().type("200");
    cy.get('[data-cy="canvas-image"]').should("have.css", "width", "250px");
    cy.get('[data-cy="canvas-image"]').should("have.css", "height", "200px");

    // Testar com divider
    cy.get('[data-cy="sidebar-divider"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    cy.get('[data-cy="canvas-divider"]').click();
    cy.get('[data-cy="property-width"]').clear().type("350");
    cy.get('[data-cy="canvas-divider"]').should("have.css", "width", "350px");
  });

  it("deve respeitar limites mínimos e máximos", () => {
    // Adicionar um componente
    cy.get('[data-cy="sidebar-textarea"]').trigger("dragstart");
    cy.get('[data-cy="canvas"]').trigger("drop");

    cy.get('[data-cy="canvas-textarea"]').click();

    // Tentar definir valores muito pequenos
    cy.get('[data-cy="property-width"]').clear().type("10");
    cy.get('[data-cy="property-height"]').clear().type("5");

    // Verificar se os valores foram ajustados para os mínimos
    cy.get('[data-cy="canvas-textarea"]').should("have.css", "width", "50px");
    cy.get('[data-cy="canvas-textarea"]').should("have.css", "height", "20px");

    // Tentar valores muito grandes
    cy.get('[data-cy="property-width"]').clear().type("1000");
    cy.get('[data-cy="property-height"]').clear().type("1000");

    // Verificar se os valores foram limitados
    cy.get('[data-cy="canvas-textarea"]').should("have.css", "width", "800px");
    cy.get('[data-cy="canvas-textarea"]').should("have.css", "height", "600px");
  });
});
