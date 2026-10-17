
import { expect } from "expect-webdriverio";

export default class CartPage {
  constructor(driver) {
    this.driver = driver;
  }

  async validarCurso(nome, preco) {
    const nomeCarrinho = await this.driver.$(
      `-android uiautomator:new UiSelector().text("${nome}")`
    );

    await nomeCarrinho.waitForDisplayed({ timeout: 10000 });
    await expect(await nomeCarrinho.getText()).toEqual(nome);

    // O preço individual começa pelo valor, ao contrário do total
    const precoCarrinho = await this.driver.$(
      `//android.widget.TextView[starts-with(@text, "${preco}")]`
    );

    await precoCarrinho.waitForDisplayed({ timeout: 10000 });

    const textoPreco = (await precoCarrinho.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    await expect(textoPreco).toContain(preco);
  }

  async validarTotal(preco) {
    const total = await this.driver.$(
      `//android.widget.TextView[contains(@text, "Total:") and contains(@text, "${preco}")]`
    );

    await total.waitForDisplayed({ timeout: 10000 });

    const textoTotal = (await total.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    await expect(textoTotal).toContain("Total:");
    await expect(textoTotal).toContain(preco);
  }

  async processarPagamento() {
    const botaoPagamento = await this.driver.$(
      '-android uiautomator:new UiSelector().text("Processar pagamento")'
    );

    await botaoPagamento.waitForDisplayed({ timeout: 10000 });
    await botaoPagamento.click();

    const cursoInicial = await this.driver.$(
      "~Programação com Kotlin"
    );

    await cursoInicial.waitForDisplayed({ timeout: 10000 });
  }
}