import {
  Before,
  After,
  Given,
  When,
  Then,
  setDefaultTimeout,
} from "@cucumber/cucumber";

import { remote } from "webdriverio";
import { expect } from "expect-webdriverio";

setDefaultTimeout(30 * 1000);
let driver;

Before(async function () {
  const caps = {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",
    "appium:appPackage": "com.example.democoursesforqa",
    "appium:appActivity": ".MainActivity",
    "appium:automationName": "UiAutomator2",
    "appium:noReset": true,
  };

  driver = await remote({
    protocol: "http",
    hostname: "127.0.0.1",
    port: 4723,
    path: "/",
    capabilities: caps,
  });
});

After(async function () {
  if (driver) {
    await driver.deleteSession();
    driver = undefined;
  }
});

// Given: garantir que estamos no catálogo
Given("que o catálogo de cursos está aberto", async function () {
  const voltarCatalogo = await driver.$(
    '-android uiautomator:new UiSelector().text("Voltar ao catálogo")'
  );

  if (await voltarCatalogo.isDisplayed().catch(() => false)) {
    await voltarCatalogo.click();
  }

  const curso = await driver.$("~Programação com Kotlin");
  await curso.waitForDisplayed({ timeout: 10000 });

  console.log("Catálogo de cursos aberto!");
});

// When: selecionar o curso e validar o preço na listagem
When(
  "seleciono o curso {string} com preço {string}",
  async function (nome, preco) {
    this.curso = nome;
    this.preco = preco;

    const curso = await driver.$(`~${nome}`);
    await curso.waitForDisplayed({ timeout: 10000 });

    await expect(await curso.getAttribute("content-desc"))
      .toEqual(nome);

    const precoLista = await driver.$(
      `-android uiautomator:new UiSelector().textContains("${preco}")`
    );

    await precoLista.waitForDisplayed({ timeout: 10000 });

    const textoPreco = (await precoLista.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    await expect(textoPreco).toContain(preco);

    await curso.click();

    console.log(`Curso selecionado: ${nome}`);
    console.log(`Preço na listagem validado: ${preco}`);
  }
);

// Then: validar nome e preço nos detalhes
Then(
  "o nome e o preço são apresentados nos detalhes",
  async function () {
    const nomeDetalhes = await driver.$(
      `-android uiautomator:new UiSelector().text("${this.curso}")`
    );

    await nomeDetalhes.waitForDisplayed({ timeout: 10000 });
    await expect(await nomeDetalhes.getText()).toEqual(this.curso);

    const precoDetalhes = await driver.$(
      `-android uiautomator:new UiSelector().textContains("${this.preco}")`
    );

    await precoDetalhes.waitForDisplayed({ timeout: 10000 });

    const textoPreco = (await precoDetalhes.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    await expect(textoPreco).toContain(this.preco);

    console.log("Nome e preço validados nos detalhes!");
  }
);

// When: adicionar o curso ao carrinho
When("adiciono o curso ao carrinho", async function () {
  const adicionar = await driver.$(
    '-android uiautomator:new UiSelector().text("Adicionar ao carrinho")'
  );

  await adicionar.waitForDisplayed({ timeout: 10000 });
  await adicionar.click();

  const contador = await driver.$(
    '-android uiautomator:new UiSelector().text("Carrinho (1)")'
  );

  await contador.waitForDisplayed({ timeout: 10000 });
  await contador.click();

  console.log("Curso adicionado; carrinho aberto!");
});

// Then: validar o nome e o preço individual no carrinho
Then(
  "o carrinho apresenta o curso {string} com preço {string}",
  async function (nome, preco) {
    const nomeCarrinho = await driver.$(
      `-android uiautomator:new UiSelector().text("${nome}")`
    );

    await nomeCarrinho.waitForDisplayed({ timeout: 10000 });
    await expect(await nomeCarrinho.getText()).toEqual(nome);

    // O preço individual começa pelo valor; o total começa por "Total:"
    const precoCarrinho = await driver.$(
      `//android.widget.TextView[starts-with(@text, "${preco}")]`
    );

    await precoCarrinho.waitForDisplayed({ timeout: 10000 });

    const textoPreco = (await precoCarrinho.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    await expect(textoPreco).toContain(preco);

    console.log(`Nome e preço validados no carrinho: ${nome}`);
  }
);

// Then: validar o total do carrinho
Then("o total do carrinho é {string}", async function (preco) {
  const total = await driver.$(
    `//android.widget.TextView[contains(@text, "Total:") and contains(@text, "${preco}")]`
  );

  await total.waitForDisplayed({ timeout: 10000 });

  const textoTotal = (await total.getText())
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  await expect(textoTotal).toContain("Total:");
  await expect(textoTotal).toContain(preco);

  console.log(`Total do carrinho validado: ${textoTotal}`);
});


Then(
  "processo o pagamento e regresso à página inicial",
  async function () {
    const botaoPagamento = await driver.$(
      '-android uiautomator:new UiSelector().text("Processar pagamento")'
    );

    await botaoPagamento.waitForDisplayed({ timeout: 10000 });
    await botaoPagamento.click();

    // Validar que a aplicação regressou à página inicial
    const cursoInicial = await driver.$("~Programação com Kotlin");

    await cursoInicial.waitForDisplayed({ timeout: 10000 });

    console.log("Pagamento processado!");
    console.log("Regresso à página inicial validado!");
  }
);