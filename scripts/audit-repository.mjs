import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "README.md",
  "README.zh-CN.md",
  "AGENTS.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  ".gitignore",
  ".github/CODEOWNERS",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/workflows/test.yml",
  ".github/workflows/codeql.yml",
  ".github/dependabot.yml",
  "docs/repository-standard.md",
];

const failures = [];
for (const relative of required) {
  if (!existsSync(join(root, relative))) failures.push(`missing: ${relative}`);
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const script of ["test", "build", "audit:repo", "package:simple"]) {
  if (!packageJson.scripts?.[script]) failures.push(`missing npm script: ${script}`);
}
if (!packageJson.engines?.node) failures.push("missing package.json engines.node");

const english = readFileSync(join(root, "README.md"), "utf8");
const chinese = readFileSync(join(root, "README.zh-CN.md"), "utf8");
if (!english.includes("README.zh-CN.md")) failures.push("README.md does not link to README.zh-CN.md");
if (!chinese.includes("README.md")) failures.push("README.zh-CN.md does not link to README.md");
if (!english.includes("actions/workflows/test.yml/badge.svg")) failures.push("README.md is missing the CI badge");

if (failures.length) {
  console.error("Repository audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Repository audit passed (${required.length} required files and metadata checks).`);
}
