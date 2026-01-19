const { By } = require("selenium-webdriver");
const {
  dismissAlertIfPresent,
  loginAsAdmin,
  waitForAnyVisible,
  waitForVisible,
} = require("./admin-tab-helpers");

const loadingLocator = By.css("[role='progressbar']");
const tab = {
  label: "FinalizeBets",
  locators: [
    By.xpath("//h1[contains(., 'Finalize Bets')]"),
    By.xpath("//*[contains(., 'No patients with active bets found')]"),
    By.xpath("//th[contains(., 'First Name')]"),
  ],
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
    log("Waiting for bet data to finish loading");
    const alertText = await dismissAlertIfPresent(
      driver,
      Math.min(5000, config.pageLoadTimeoutMs)
    );
    if (alertText) {
      log(`Dismissed alert: ${alertText}`);
    }
    try {
      await waitForAnyVisible(
        driver,
        tab.locators,
        config.pageLoadTimeoutMs * 3
      );
    } catch (error) {
      const loadingMatches = await driver.findElements(loadingLocator);
      if (loadingMatches.length > 0 && (await loadingMatches[0].isDisplayed())) {
        throw new Error(
          "FinalizeBets stayed in loading state. Backend endpoints " +
            "(/getBetPatients, /getVisitBets) may be unavailable."
        );
      }
      throw error;
    }
  }
};
