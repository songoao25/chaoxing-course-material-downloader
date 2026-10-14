# GitHub Repository Standard

This is the reusable repository preparation template for `SONGOAO25` projects.
Use it before the first public push and before every release-oriented push.

## Repository metadata

- [ ] Repository name is stable, lowercase, and descriptive.
- [ ] About description is English by default and concise enough for GitHub.
- [ ] Homepage is empty unless the project has a real documentation site, demo, or landing page.
- [ ] Topics use lowercase, discoverable terms; remove duplicates and unrelated terms.
- [ ] Visibility, Issues, Discussions, Wiki, Projects, and merge settings are intentional.
- [ ] Default branch is `main`.
- [ ] Main branch protection or ruleset requires the relevant CI checks and blocks force pushes/deletion.

## Public documentation

- [ ] `README.md` is the English primary entry point.
- [ ] `README.zh-CN.md` is present for a Chinese-facing project and links back to `README.md`.
- [ ] README includes badges for CI, release, last commit, license, and security scanning when enabled.
- [ ] README explains what it does, who it is for, quick start, support matrix, limitations, privacy, and troubleshooting.
- [ ] License is present at repository root and agrees with README and package metadata.
- [ ] `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md` are present.
- [ ] `AGENTS.md` explains repository structure, safe data boundaries, checks, and completion reporting.
- [ ] User-facing documentation does not expose private URLs, credentials, personal paths, or real user data.

## Automation and release

- [ ] CI runs tests and build on pushes and pull requests.
- [ ] CodeQL or an equivalent code-scanning workflow is enabled where supported.
- [ ] Dependabot or an equivalent dependency-update process is enabled.
- [ ] Issue forms and a pull-request template collect reproduction, verification, and security information.
- [ ] Release packaging puts required manifests at the package root.
- [ ] Version follows semantic versioning; prerelease status is explicit.
- [ ] Release notes state tested browsers/platforms and distinguish static checks from real runtime checks.

## Pre-push gate

Run the project-specific checks first:

```sh
npm run audit:repo
npm test
npm run build
npm run package:simple
git diff --check
```

Then inspect the staged diff, scan for secrets, and verify that no course materials,
cookies, authenticated URLs, logs, or personal filesystem paths are included.

## Post-push readback

- [ ] Remote `main` points to the intended commit.
- [ ] Required checks pass for that commit.
- [ ] Repository description, homepage, topics, visibility, and branch protection match intent.
- [ ] Release assets and prerelease status are correct when a tag was pushed.
- [ ] Open Dependabot updates were reviewed; never auto-merge them without inspection.

## Project-specific additions

Each repository may add stricter checks, but must not silently remove the defaults
above. Record exceptions in the repository's audit document with a reason and date.
