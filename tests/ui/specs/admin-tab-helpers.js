const { By, until } = require("selenium-webdriver");

async function waitForAnyVisible(driver, locators, timeoutMs) {
  return driver.wait(
    async () => {
      for (const locator of locators) {
        const matches = await driver.findElements(locator);
        if (matches.length === 0) {
          continue;
        }
        try {
          if (await matches[0].isDisplayed()) {
            return { locator, element: matches[0] };
          }
        } catch (error) {
          // ignore stale or detached elements and keep waiting
        }
      }
      return false;
    },
    timeoutMs,
    "Timed out waiting for expected element"
  );
}


async function waitForVisible(driver, locator, timeoutMs) {
  const element = await driver.wait(
    until.elementLocated(locator),
    timeoutMs
  );
  await driver.wait(until.elementIsVisible(element), timeoutMs);
  return element;
}

async function dismissAlertIfPresent(driver, timeoutMs) {
  try {
    await driver.wait(until.alertIsPresent(), timeoutMs);
    const alert = await driver.switchTo().alert();
    const text = await alert.getText();
    await alert.accept();
    return text;
  } catch (error) {
    return null;
  }
}

async function loginAsAdmin(driver, config, log) {
  log(`Opening ${config.baseUrl}`);
  await driver.get(config.baseUrl);

  const usernameInput = await waitForVisible(
    driver,
    By.css("input[type='text']"),
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

  const loginErrorLocator = By.xpath(
    "//*[contains(., 'Invalid username or password') or contains(., 'Login failed')]"
  );
  const postLogin = await waitForAnyVisible(
    driver,
    [By.linkText("Patients"), loginErrorLocator],
    config.pageLoadTimeoutMs
  );

  if (postLogin.locator === loginErrorLocator) {
    throw new Error("Admin login failed. Check admin credentials and backend.");
  }
}

module.exports = {
  dismissAlertIfPresent,
  loginAsAdmin,
  waitForAnyVisible,
  waitForVisible,
};
