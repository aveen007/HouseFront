const { By, until } = require("selenium-webdriver");

module.exports = async ({ driver, config, log }) => {
  log(`Opening ${config.baseUrl}`);
  await driver.get(config.baseUrl);

  const usernameInput = await driver.wait(
    until.elementLocated(By.css("input[type='text']")),
    config.pageLoadTimeoutMs
  );
  const passwordInput = await driver.findElement(
    By.css("input[type='password']")
  );
  const submitButton = await driver.findElement(
    By.css("button[type='submit']")
  );

  await usernameInput.clear();
  await usernameInput.sendKeys("admin");
  await passwordInput.clear();
  await passwordInput.sendKeys("password");
  await submitButton.click();

  log("Waiting for admin navigation after login");
  await driver.wait(
    until.elementLocated(By.linkText("Patients")),
    config.pageLoadTimeoutMs
  );
};
