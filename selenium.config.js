const path = require("path");

module.exports = {
  baseUrl: process.env.UI_BASE_URL || "http://localhost:3000",
  browser: process.env.UI_BROWSER || "chrome",
  headless: process.env.UI_HEADLESS !== "false",
  slowMoMs: Number(process.env.UI_SLOW_MO_MS || 0),
  implicitWaitMs: Number(process.env.UI_IMPLICIT_WAIT_MS || 5000),
  pageLoadTimeoutMs: Number(process.env.UI_PAGELOAD_TIMEOUT_MS || 30000),
  scriptTimeoutMs: Number(process.env.UI_SCRIPT_TIMEOUT_MS || 30000),
  screenshotsDir:
    process.env.UI_SCREENSHOTS_DIR ||
    path.resolve(__dirname, "tests", "ui", "screenshots"),
  artifactsDir:
    process.env.UI_ARTIFACTS_DIR ||
    path.resolve(__dirname, "tests", "ui", "artifacts"),
};
