const { By } = require("selenium-webdriver");
const {
  dismissAlertIfPresent,
  loginAsAdmin,
  waitForAnyVisible,
  waitForVisible,
} = require("./admin-tab-helpers");

const loadingLocator = By.css(".loading");
const tab = {
  label: "CreateContract",
  locators: [By.xpath("//h1[contains(., 'Create Legal Contract')]")],
};

module.exports = async ({ driver, config, log }) => {
  await loginAsAdmin(driver, config, log);

  log(`Opening ${tab.label} tab`);
  const tabLink = await waitForVisible(
    driver,
    By.linkText(tab.label),
    config.pageLoadTimeoutMs
  );

  const href = await tabLink.getAttribute("href");
  await tabLink.click();

  log("Checking url");
  await driver.wait(
    async () => {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl === href || currentUrl.startsWith(`${href}?`);
    },
    config.pageLoadTimeoutMs
  );

  log("Checking elements");
  const firstVisible = await waitForAnyVisible(
    driver,
    [loadingLocator, ...tab.locators],
    config.pageLoadTimeoutMs
  );

  if (firstVisible.locator === loadingLocator) {
    log("Waiting for contract data to finish loading");
    const alertText = await dismissAlertIfPresent(
      driver,
      Math.min(5000, config.pageLoadTimeoutMs)
    );
    if (alertText) {
      log(`Dismissed alert: ${alertText}`);
    }
    await waitForAnyVisible(
      driver,
      tab.locators,
      config.pageLoadTimeoutMs * 3
    );
  }
};
