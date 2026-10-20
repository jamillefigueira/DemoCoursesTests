import "dotenv/config";
import {
  Before,
  After,
  Given,
  When,
  Then,
  setDefaultTimeout,
} from "@cucumber/cucumber";

import { remote } from "webdriverio";

import CatalogPage from "../../pages/CatalogPage.js";
import DetailsPage from "../../pages/DetailsPage.js";
import CartPage from "../../pages/CartPage.js";

setDefaultTimeout(120 * 1000);



Before(async function () {
  console.log("A iniciar sessão na Sauce Labs...");

  console.log("Credenciais configuradas:", {
    username: Boolean(process.env.SAUCE_USERNAME),
    accessKey: Boolean(process.env.SAUCE_ACCESS_KEY),
    appId: Boolean(process.env.SAUCE_APP_ID),
  });

  if (
    !process.env.SAUCE_USERNAME ||
    !process.env.SAUCE_ACCESS_KEY ||
    !process.env.SAUCE_APP_ID
  ) {
    throw new Error(
      "Faltam variáveis SAUCE_USERNAME, SAUCE_ACCESS_KEY ou SAUCE_APP_ID no .env"
    );
  }

  const caps = {
    platformName: "Android",
    "appium:deviceName": "Google Pixel 6 Emulator",
    "appium:platformVersion": "16.0",
    "appium:automationName": "UiAutomator2",
    "appium:app": `storage:${process.env.SAUCE_APP_ID}`,
    "sauce:options": {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      appiumVersion: "2.11.0",
      build: "TCC QA",
      name: "DemoCourses - Cucumber",
      deviceOrientation: "PORTRAIT",
    },
  };

  try {
    this.driver = await remote({
      protocol: "https",
      hostname: "ondemand.eu-central-1.saucelabs.com",
      port: 443,
      path: "/wd/hub",
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY,
      connectionRetryTimeout: 120000,
      capabilities: caps,
    });

    console.log("Sessão criada:", this.driver.sessionId);

    this.catalogPage = new CatalogPage(this.driver);
    this.detailsPage = new DetailsPage(this.driver);
    this.cartPage = new CartPage(this.driver);
  } catch (error) {
    console.error("Erro ao criar a sessão:", error.message);
    throw error;
  }
});

After(async function () {
  if (this.driver) {
    await this.driver.deleteSession();
    this.driver = undefined;
  }
});

Given("que o catálogo de cursos está aberto", async function () {
  await this.catalogPage.abrirCatalogo();

  console.log("Catálogo de cursos aberto!");
});

When(
  "seleciono o curso {string} com preço {string}",
  async function (nome, preco) {
    this.curso = nome;
    this.preco = preco;

    await this.catalogPage.validarCursoNaLista(nome, preco);
    await this.catalogPage.selecionarCurso(nome);

    console.log(`Curso selecionado: ${nome}`);
  }
);

Then(
  "o nome e o preço são apresentados nos detalhes",
  async function () {
    await this.detailsPage.validarNomeEPreco(
      this.curso,
      this.preco
    );

    console.log("Nome e preço validados nos detalhes!");
  }
);

When("adiciono o curso ao carrinho", async function () {
  await this.detailsPage.adicionarAoCarrinho();

  console.log("Curso adicionado ao carrinho!");
});

Then(
  "o carrinho apresenta o curso {string} com preço {string}",
  async function (nome, preco) {
    await this.cartPage.validarCurso(nome, preco);

    console.log("Nome e preço validados no carrinho!");
  }
);

Then("o total do carrinho é {string}", async function (preco) {
  await this.cartPage.validarTotal(preco);

  console.log("Total do carrinho validado!");
});

Then(
  "processo o pagamento e regresso à página inicial",
  async function () {
    await this.cartPage.processarPagamento();

    console.log("Pagamento processado!");
    console.log("Regresso à página inicial validado!");
  }
);