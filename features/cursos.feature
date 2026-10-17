
Feature: Validar cursos no carrinho

  Scenario Outline: Validar nome e preço de um curso
    Given que o catálogo de cursos está aberto
    When seleciono o curso "<curso>" com preço "<preco>"
    Then o nome e o preço são apresentados nos detalhes
    When adiciono o curso ao carrinho
    Then o carrinho apresenta o curso "<curso>" com preço "<preco>"
    And o total do carrinho é "<preco>"
    And processo o pagamento e regresso à página inicial

    Examples:
      | curso                   | preco |
      | Programação com Kotlin  | 49,90 |
      | Marketing Digital       | 39,90 |