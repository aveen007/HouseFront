const fs = require("fs");
const path = require("path");
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("../../selenium.config");
const runSqlSeed = require("./runSqlSeed");
async function buildDriver() {
  const options = new chrome.Options();
  options.addArguments("--disable-gpu");
  options.addArguments("--window-size=1200,800");
  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

function listSpecFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".spec.js"))
    .map(f => path.join(dir, f));
}

async function runSpec(specPath) {
  const spec = require(specPath);
  const driver = await buildDriver();
  const log = (msg) => console.log(`[${path.basename(specPath)}] ${msg}`);
  try {
    await spec({ driver, config, log });
  } finally {
    await driver.quit();
  }
}

async function runAll() {
runSqlSeed();
  const specsDir = path.resolve(__dirname, "specs");
  const specFiles = listSpecFiles(specsDir);
  for (const specPath of specFiles) {
    await runSpec(specPath);
  }
}

runAll().catch(err => console.error(err));
