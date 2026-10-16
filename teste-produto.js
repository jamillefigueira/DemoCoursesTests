
import { remote } from "webdriverio";
import { expect } from "expect-webdriverio";

async function main() {
  const caps = {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",
    "appium:appPackage": "com.example.democoursesforqa",
    "appium:appActivity": ".MainActivity",
    "appium:automationName": "UiAutomator2",
    "appium:noReset": true,
  };

  const driver = await remote({
    protocol: "http",
    hostname: "127.0.0.1",
    port: 4723,
    path: "/",
    capabilities: caps,
  });

  try {
    // 1. Selecionar o curso na listagem
    const curso = await driver.$("~Programação com Kotlin");
    await curso.waitForDisplayed({ timeout: 10000 });

    // 2. Validar o nome e o preço na listagem
    await expect(await curso.getAttribute("content-desc")).toEqual(
      "Programação com Kotlin"
    );

    const precoLista = await driver.$(
      '-android uiautomator:new UiSelector().textContains("49,90")'
    );

    await precoLista.waitForDisplayed({ timeout: 10000 });

    const textoPrecoLista = (await precoLista.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    await expect(textoPrecoLista).toContain("49,90");

    console.log("1. Nome e preço validados na listagem!");

    // 3. Abrir os detalhes do curso
    await curso.click();

    // 4. Validar o nome nos detalhes
    const nomeDetalhes = await driver.$(
      '-android uiautomator:new UiSelector().text("Programação com Kotlin")'
    );

    await nomeDetalhes.waitForDisplayed({ timeout: 10000 });

    await expect(await nomeDetalhes.getText()).toEqual(
      "Programação com Kotlin"
    );

    console.log("2. Nome nos detalhes validado!");

    // 5. Validar o preço nos detalhes
    const precoDetalhes = await driver.$(
      '-android uiautomator:new UiSelector().textContains("49,90")'
    );

    await precoDetalhes.waitForDisplayed({ timeout: 10000 });

    const textoPrecoDetalhes = (await precoDetalhes.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    console.log("Preço nos detalhes:", JSON.stringify(textoPrecoDetalhes));

    await expect(textoPrecoDetalhes).toContain("49,90");

    console.log("3. Preço nos detalhes validado!");

    // 6. Adicionar o curso ao carrinho
    const botaoAdicionar = await driver.$(
      '-android uiautomator:new UiSelector().text("Adicionar ao carrinho")'
    );

    await botaoAdicionar.waitForDisplayed({ timeout: 10000 });
    await botaoAdicionar.click();

    console.log("4. Curso adicionado ao carrinho!");

    // 7. Validar o contador do carrinho
    const contadorCarrinho = await driver.$(
      '-android uiautomator:new UiSelector().text("Carrinho (1)")'
    );

    await contadorCarrinho.waitForDisplayed({ timeout: 10000 });

    await expect(await contadorCarrinho.getText()).toEqual("Carrinho (1)");

    console.log("5. Contador do carrinho validado!");

    // 8. Abrir o carrinho
    await contadorCarrinho.click();

    // 9. Validar o nome do curso no carrinho
    const nomeNoCarrinho = await driver.$(
      '-android uiautomator:new UiSelector().text("Programação com Kotlin")'
    );

    await nomeNoCarrinho.waitForDisplayed({ timeout: 10000 });

    await expect(await nomeNoCarrinho.getText()).toEqual(
      "Programação com Kotlin"
    );

    console.log("6. Nome do curso validado no carrinho!");

    // 10. Validar o preço individual no carrinho.
    // O XPath normaliza o espaço especial entre o valor e o símbolo €.
    const precoNoCarrinho = await driver.$(
      `//android.widget.TextView[
        normalize-space(translate(@text, " ", " ")) = "49,90 €"
      ]`
    );

    await precoNoCarrinho.waitForDisplayed({ timeout: 10000 });

    const textoPrecoCarrinho = (await precoNoCarrinho.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    console.log("Preço individual:", JSON.stringify(textoPrecoCarrinho));

    await expect(textoPrecoCarrinho).toContain("49,90");

    console.log("7. Preço individual validado no carrinho!");

    // 11. Validar o total do carrinho.
    // O critério "Total:" distingue-o do preço individual.
    const totalCarrinho = await driver.$(
      '//android.widget.TextView[contains(@text, "Total:") and contains(@text, "49,90")]'
    );

    await totalCarrinho.waitForDisplayed({ timeout: 10000 });

    const textoTotalCarrinho = (await totalCarrinho.getText())
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    console.log("Total do carrinho:", JSON.stringify(textoTotalCarrinho));

    await expect(textoTotalCarrinho).toContain("Total:");
    await expect(textoTotalCarrinho).toContain("49,90");

    console.log("8. Total do carrinho validado!");

    console.log("TESTE CONCLUÍDO COM SUCESSO!");
  } finally {
    await driver.deleteSession();
  }
}

main().catch((erro) => {
  console.error("FALHA NO TESTE:", erro);
  process.exitCode = 1;
});