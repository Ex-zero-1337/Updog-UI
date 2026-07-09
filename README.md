# Updog Beautified UI Fork

![Version 2.0.1](http://img.shields.io/badge/version-v2.0.1-green.svg)
![Python 3.11+](http://img.shields.io/badge/python-3.11+-blue.svg)
[![MIT License](http://img.shields.io/badge/license-MIT%20License-blue.svg)](https://github.com/sc0tfree/updog/blob/master/LICENSE)

This is a fork of the original [updog](https://github.com/sc0tfree/updog) Python file server with a refreshed web interface, safer preview handling, and a more polished browsing workflow.

Updog remains a lightweight replacement for Python's `SimpleHTTPServer`: it serves files over HTTP/S, supports browser uploads and downloads, can use HTTP basic auth, can enable CORS, and can run with ad hoc or custom SSL certificates.

## Thanks To Original Updog

Huge thanks to [sc0tfree/updog](https://github.com/sc0tfree/updog) for the original project and to [Nicholas Smith](http://nixmith.com) for the updog logo. This fork keeps the spirit and core behavior of Updog, then adds a beautified UI and safer preview experience on top.

## Screenshots

### Latest Directory UI

![Updog UI](assets/new-ui.png)

### Preview Sample

![Updog Markdown preview](assets/preview.png)

## Current Support

- Serve a directory over HTTP.
- Upload one or multiple files from the browser.
- Download any served file.
- Search and sort directory entries with DataTables.
- Password-protect access with HTTP basic auth.
- Serve with ad hoc SSL or custom certificate/key files.
- Enable CORS for web application testing.
- Hide the base directory path with `--hide-base-path`.

## Enhancements In This Fork

- Modern responsive UI with a cleaner header, stats, upload controls, and compact file rows.
- Per-file actions: `Preview`, `Download`, or `No preview` depending on extension support.
- Rendered Markdown previews for `.md` and `.markdown`.
- Sandboxed HTML previews for `.html` and `.htm`.
- Escaped text/code previews for common plain text and source formats.
- Safer path validation using `os.path.commonpath()` instead of string-prefix checks.
- Sanitized Markdown output using `bleach`.
- Static `preview.html` for quickly checking the UI without starting the Flask server.

## Preview Support

| Type | Extensions | Behavior |
| --- | --- | --- |
| Markdown | `.md`, `.markdown` | Rendered to HTML and sanitized before display |
| HTML | `.html`, `.htm` | Rendered inside a sandboxed iframe with scripts disabled |
| Text/code | `.txt`, `.css`, `.js`, `.json`, `.xml`, `.csv`, `.log`, `.yml`, `.yaml`, `.ini`, `.cfg`, `.conf`, `.py`, `.rb`, `.go`, `.rs`, `.java`, `.c`, `.h`, `.cpp`, `.hpp`, `.cs`, `.sh`, `.zsh`, `.bash`, `.sql`, `.toml` | Escaped and displayed in a code-style preview |
| Browser-native media | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.bmp`, `.ico`, `.pdf`, `.mp3`, `.wav`, `.ogg`, `.m4a`, `.mp4`, `.webm`, `.mov` | Opened through the browser's native viewer |
| Other files | Any unsupported extension | Download only, with `No preview` shown in the UI |

## Installation

Install from the project directory:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -e .
```

Or install the original package from PyPI:

```bash
pip install updog
```

For isolated CLI usage:

```bash
pipx install updog
```

## Usage

```bash
updog [-d DIRECTORY] [-b ADDRESS] [-p PORT] [--password PASSWORD] [--ssl | --ssl-cert CERT --ssl-key KEY] [--cors] [--hide-base-path]
```

| Argument | Description |
| --- | --- |
| `-d DIRECTORY`, `--directory DIRECTORY` | Root directory. Default: current directory |
| `-b ADDRESS`, `--bind ADDRESS` | Bind to a specific address. Default: `0.0.0.0` |
| `-p PORT`, `--port PORT` | Port to serve. Default: `9090` |
| `--password PASSWORD` | Use a password to access the page. Leave username blank at login |
| `--ssl` | Enable SSL with an ad hoc certificate |
| `--ssl-cert CERT` | Path to a custom SSL certificate |
| `--ssl-key KEY` | Path to a custom SSL private key |
| `--cors` | Enable CORS headers |
| `--hide-base-path` | Hide the full directory path and show relative paths |
| `--version` | Show version |
| `-h`, `--help` | Show help |

## Examples

Serve from your current directory:

```bash
updog
```

Serve another directory:

```bash
updog -d /another/directory
```

Serve from port `1234`:

```bash
updog -p 1234
```

Password-protect the page:

```bash
updog --password examplePassword123!
```

Use SSL with an ad hoc certificate:

```bash
updog --ssl
```

Use SSL with custom certificates:

```bash
updog --ssl-cert /path/to/cert.pem --ssl-key /path/to/key.pem
```

Bind to a specific IP address:

```bash
updog -b 192.168.1.10 -p 8080
```

Enable CORS:

```bash
updog --cors
```

Hide full directory paths:

```bash
updog --hide-base-path
```

## Development

Run this fork locally from the repository:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -e .
.venv/bin/updog --bind 127.0.0.1 -p 9090 -d .
```

Then open:

```text
http://127.0.0.1:9090
```

For UI-only inspection without Flask, open:

```text
preview.html
```

## Security Notes

- Keep `--bind 127.0.0.1` for local-only testing.
- Use `--password` when serving on a reachable network.
- Use `--ssl` or custom certificates when credentials or sensitive files may cross an untrusted network.
- HTML previews are sandboxed and scripts are disabled, but serving untrusted files is still something to treat with care.

## What's updog?

Not much, how about you?
