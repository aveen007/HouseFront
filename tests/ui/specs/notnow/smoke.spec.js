const { By, until } = require("selenium-webdriver");

module.exports = async ({ driver, config, log }) => {
  log(`Opening ${config.baseUrl}`);
  await driver.get(config.baseUrl);

  await driver.wait(until.elementLocated(By.id("root")), config.pageLoadTimeoutMs);
  const root = await driver.findElement(By.id("root"));

  const isDisplayed = await root.isDisplayed();
  if (!isDisplayed) {
    throw new Error("App root is not visible.");
  }
};
