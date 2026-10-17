
import { expect } from "expect-webdriverio";

export default class DetailsPage {
  constructor(driver) {
    this.driver = driver;
  }

  async validarNomeEPreco(nome, preco) {
    const nomeDetalhes = await this.driver.$(
      `-android uiautomator:new UiSelector().text("${nome}")`
    );

    await nomeDetalhes.waitForDisplayed({ timeout: 10000 });
    await expect(await nomeDetalhes.getText()).toEqual(nome);

    const elementoPreco = await this.driver.$(
      `-android uiautomator:new UiSelector().textContains("${preco}")`
    );

    await elementoPreco.waitForDisplayed({ timeout: 10000 });

    const textoPreco = (await elementoPreco.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    await expect(textoPreco).toContain(preco);
  }

  async adicionarAoCarrinho() {
    const botao = await this.driver.$(
      '-android uiautomator:new UiSelector().text("Adicionar ao carrinho")'
    );

    await botao.waitForDisplayed({ timeout: 10000 });
    await botao.click();

    const contador = await this.driver.$(
      '-android uiautomator:new UiSelector().text("Carrinho (1)")'
    );

    await contador.waitForDisplayed({ timeout: 10000 });
    await contador.click();
  }
}