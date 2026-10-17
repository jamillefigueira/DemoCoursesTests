
import { expect } from "expect-webdriverio";

export default class CatalogPage {
  constructor(driver) {
    this.driver = driver;
  }

  async abrirCatalogo() {
    const voltar = await this.driver.$(
      '-android uiautomator:new UiSelector().textContains("Voltar ao catálogo")'
    );

    if (await voltar.isDisplayed().catch(() => false)) {
      await voltar.click();
    }

    const cursoInicial = await this.driver.$(
      "~Programação com Kotlin"
    );

    await cursoInicial.waitForDisplayed({ timeout: 10000 });
  }

  async validarCursoNaLista(nome, preco) {
    const curso = await this.driver.$(`~${nome}`);

    await curso.waitForDisplayed({ timeout: 10000 });

    await expect(await curso.getAttribute("content-desc"))
      .toEqual(nome);

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

  async selecionarCurso(nome) {
    const curso = await this.driver.$(`~${nome}`);

    await curso.waitForDisplayed({ timeout: 10000 });
    await curso.click();
  }
}