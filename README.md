# Chaoxing Course Material Downloader

**English** | [中文](README.zh-CN.md)

[![CI](https://github.com/songoao25/chaoxing-course-material-downloader/actions/workflows/test.yml/badge.svg)](https://github.com/songoao25/chaoxing-course-material-downloader/actions/workflows/test.yml)
[![CodeQL](https://github.com/songoao25/chaoxing-course-material-downloader/actions/workflows/codeql.yml/badge.svg)](https://github.com/songoao25/chaoxing-course-material-downloader/actions/workflows/codeql.yml)
[![Release](https://img.shields.io/github/v/release/songoao25/chaoxing-course-material-downloader?include_prereleases)](https://github.com/songoao25/chaoxing-course-material-downloader/releases)
[![Last commit](https://img.shields.io/github/last-commit/songoao25/chaoxing-course-material-downloader)](https://github.com/songoao25/chaoxing-course-material-downloader/commits/main)
[![License](https://img.shields.io/github/license/songoao25/chaoxing-course-material-downloader)](LICENSE)

A local-first WebExtension for downloading files from a logged-in Chaoxing course. It scans the **Materials** area and downloadable attachments in **Chapters**, lets the user select a tree of files, and downloads them one by one while preserving the course structure.

> **Status: Alpha.** The project currently provides non-store packages for Chrome, Edge, and Firefox. Real authenticated browser tests across school-specific Chaoxing deployments are still required before calling it production-ready.

## Features

- Recursively scan the Materials area and nested folders.
- Scan downloadable attachments in chapters and sections.
- Select a course, folder, section, or individual file in a tree view.
- Download individual PPT, PDF, Word, Excel, archive, image, audio, and video files.
- Preserve `Downloads/Course/Materials` and `Downloads/Course/Chapters` paths.
- Retry failed downloads and show scan/download errors.
- No ZIP is created for course materials.
- No cookie export, CAPTCHA bypass, access-control bypass, or DRM decryption.

## Quick start for non-technical users

Download the latest [GitHub Release](https://github.com/songoao25/chaoxing-course-material-downloader/releases), choose Chrome, Edge, or Firefox, and follow [the simple deployment guide](docs/nontechnical-deployment.md). No Node.js is required.

Because browsers do not allow silent installation of unpacked extensions, the browser extension page requires one manual confirmation. This is the only installation step that cannot be automated in a non-store deployment.

## Browser support

| Browser | macOS | Windows | Linux | Current distribution |
| --- | :---: | :---: | :---: | --- |
| Chrome | ✓ | ✓ | ✓ | GitHub Release, load unpacked |
| Edge | ✓ | ✓ | ✓ | GitHub Release, load unpacked |
| Firefox | ✓ | ✓ | ✓ | GitHub Release, temporary load |
| Safari | — | — | — | Deferred: requires a signed macOS app |

Safari resources remain in the repository for future packaging, but Safari is not part of the current simple deployment release.

## Use

1. Log in to Chaoxing and open the target course.
2. Open the extension and select **Scan current course**.
3. Wait for Materials and Chapters to finish scanning.
4. Select the folders or files to download.
5. Select **Start download**.

Files are saved under:

```text
Downloads/
└── Course name/
    ├── Materials/
    └── Chapters/
```

## Privacy and permissions

The extension is local-first. It does not upload course materials, use analytics, or run a remote backend. It uses the current browser login session only after the user starts a scan.

Permissions are limited to:

- `downloads`: create and observe user-requested downloads.
- `tabs`: address the active course tab and request a scan.
- `storage`: reserved for local UI preferences.
- Chaoxing host access: read the course page and same-origin resource endpoints.

Read the full [privacy statement](PRIVACY.md) and [security policy](SECURITY.md). Download only material you are authorized to access and use.

## Troubleshooting

- **Scan cannot start:** refresh the logged-in course page and try again.
- **Too few files:** open the Materials/Chapters view, wait for dynamic content, and scan again.
- **Chapter attachments are missing:** the school deployment may use a different dynamic endpoint; attach only sanitized browser/version/count details to an issue.
- **Downloads fail:** check browser download permissions and retry. Never submit cookies or private URLs.
- **Firefox installation expires:** the current package is for temporary loading; long-term release installation needs Mozilla signing.

## Development and Agent use

```sh
npm test
npm run build
npm run audit:repo
npm run package:simple
node scripts/install.mjs --browser=auto --json --open
```

The machine-readable deployment contract is in [AGENTS.md](AGENTS.md). The reusable GitHub repository standard is in [docs/repository-standard.md](docs/repository-standard.md). The audit and known gaps are recorded in [docs/audit-2026-09-03.md](docs/audit-2026-09-03.md). Before a release, follow [docs/release-checklist.md](docs/release-checklist.md).

## Repository policy

- Use Conventional Commit prefixes such as `feat:`, `fix:`, `docs:`, `test:`, and `chore:`.
- Run tests and builds before submitting changes.
- Do not commit cookies, credentials, course materials, private URLs, logs, or personal paths.
- Keep public documentation user-facing and state unverified runtime behavior explicitly.

## References

- [VirtualTowel/ChaoXingDownloader](https://github.com/VirtualTowel/ChaoXingDownloader)
- [ColdThunder11/ChaoXingDownload](https://github.com/ColdThunder11/ChaoXingDownload)
- [DURUII/chaoxing-downloader](https://github.com/DURUII/chaoxing-downloader)

## License

MIT © songoao25. See [LICENSE](LICENSE).
