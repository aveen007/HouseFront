const { By } = require("selenium-webdriver");
const {
  loginAsAdmin,
  waitForAnyVisible,
  waitForVisible,
} = require("./admin-tab-helpers");

const tab = {
  label: "ApprovedTests",
  locators: [By.xpath("//h2[contains(., 'Approved Tests')]")],
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
  await waitForAnyVisible(driver, tab.locators, config.pageLoadTimeoutMs);
};
