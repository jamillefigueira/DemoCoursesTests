
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

setDefaultTimeout(30 * 1000);

Before(async function () {
  const caps = {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",
    "appium:appPackage": "com.example.democoursesforqa",
    "appium:appActivity": ".MainActivity",
    "appium:automationName": "UiAutomator2",
    "appium:noReset": true,
  };

  this.driver = await remote({
    protocol: "http",
    hostname: "127.0.0.1",
    port: 4723,
    path: "/",
    capabilities: caps,
  });

  this.catalogPage = new CatalogPage(this.driver);
  this.detailsPage = new DetailsPage(this.driver);
  this.cartPage = new CartPage(this.driver);
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