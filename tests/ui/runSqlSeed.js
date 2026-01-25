const { execSync } = require("child_process");
const path = require("path");

// ---- unique E2E name per run ----
const runId = Date.now();
const firstName = `E2E_${runId}`;
const lastName = "Patient";
const insurance = "TestInsurance";

module.exports = function runSqlSeed() {
  const sqlFile = path.resolve(__dirname, "e2e_seed_patient_insurance.sql");

  console.log("Running SQL seed with:", { firstName, lastName, insurance });

  const DB_HOST = process.env.PGHOST || "localhost";
  const DB_PORT = process.env.PGPORT || "5432";
  const DB_USER = process.env.PGUSER || "postgres";
  const DB_PASS = process.env.PGPASSWORD || "123";
  const DB_NAME = process.env.PGDATABASE || "house_db";

  // Build environment variables for execSync
  const env = { ...process.env, PGPASSWORD: DB_PASS };

  // Build command as **single-line string** (no backslash continuation)
  const cmd = `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -v ON_ERROR_STOP=1 ` +
              `-v e2e_first_name=${firstName} ` +
              `-v e2e_last_name=${lastName} ` +
              `-v e2e_company=${insurance} ` +
              `-f "${sqlFile}"`;

  try {
    execSync(cmd, { stdio: "inherit", env });
    console.log("SQL seed completed ✅");
  } catch (err) {
    console.error("SQL seed failed ❌", err);
    process.exit(1);
  }

  // Export for Selenium
  process.env.UI_E2E_FIRST_NAME = firstName;
  process.env.UI_E2E_LAST_NAME = lastName;
  process.env.UI_E2E_INSURANCE = insurance;
};
