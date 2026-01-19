const fs = require("fs");
const path = require("path");
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const config = require("../../selenium.config");

const specsDir = path.resolve(__dirname, "specs");
const screenshotsDir = config.screenshotsDir;
const artifactsDir = config.artifactsDir;

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function listSpecFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((fileName) => fileName.endsWith(".spec.js"))
    .sort()
    .map((fileName) => path.join(dirPath, fileName));
}

function toFileSafeName(name) {
  return name.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
}

async function buildDriver() {
  const browser = String(config.browser || "chrome").toLowerCase();

  if (browser === "firefox") {
    // Registers geckodriver on PATH.
    require("geckodriver");
    const options = new firefox.Options();
    if (config.headless) {
      options.addArguments("-headless");
    }
    return new Builder().forBrowser("firefox").setFirefoxOptions(options).build();
  }

  // Default to Chrome.
  require("chromedriver");
  const options = new chrome.Options();
  if (config.headless) {
    options.addArguments("--headless=new");
  }
  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function configureTimeouts(driver) {
  await driver.manage().setTimeouts({
    implicit: config.implicitWaitMs,
    pageLoad: config.pageLoadTimeoutMs,
    script: config.scriptTimeoutMs,
  });
}

async function saveFailureArtifacts(driver, specName, error) {
  ensureDir(screenshotsDir);
  ensureDir(artifactsDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeName = toFileSafeName(specName);
  const screenshotPath = path.join(
    screenshotsDir,
    `${safeName}-${timestamp}.png`
  );
  const errorPath = path.join(artifactsDir, `${safeName}-${timestamp}.log`);

  try {
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(screenshotPath, screenshot, "base64");
  } catch (screenshotError) {
    fs.writeFileSync(
      errorPath,
      `Failed to capture screenshot:\n${screenshotError.stack || screenshotError}`
    );
  }

  fs.writeFileSync(
    errorPath,
    `${error.stack || error}\n`,
    { flag: "a" }
  );
}

async function runSpec(specPath) {
  const specName = path.basename(specPath);
  const spec = require(specPath);

  if (typeof spec !== "function") {
    throw new Error(`${specName} must export a function`);
  }

  const driver = await buildDriver();
  await configureTimeouts(driver);

  const log = (message) => {
    console.log(`[${specName}] ${message}`);
  };

  try {
    await spec({ driver, config, log });
    return { status: "passed", specName };
  } catch (error) {
    await saveFailureArtifacts(driver, specName, error);
    return { status: "failed", specName, error };
  } finally {
    await driver.quit();
  }
}

async function runAll() {
  const specFiles = listSpecFiles(specsDir);

  if (specFiles.length === 0) {
    console.log("No UI specs found. Add files under tests/ui/specs.");
    return 0;
  }

  let failures = 0;
  for (const specPath of specFiles) {
    console.log(`Running ${path.basename(specPath)}...`);
    const result = await runSpec(specPath);
    if (result.status === "failed") {
      failures += 1;
      console.error(result.error);
    }
  }

  console.log(
    failures === 0
      ? "UI test run completed."
      : `UI test run completed with ${failures} failure(s).`
  );

  return failures;
}

runAll()
  .then((failures) => {
    if (failures > 0) {
      process.exitCode = 1;
    }
  })
  .catch((error) => {
    console.error("UI test runner failed:", error);
    process.exitCode = 1;
  });
