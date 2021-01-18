# Change Log

## [Unreleased]

## [0.1.0] - 2021-01-18

### Added

- Refactor: use semantic API
- Support config for matching file extension / language id (implement using semantic API)

## [0.0.3] - 2020-12-09

### Fixed

- Syntax error when missing template-ending in go source.

## [0.0.2] - 2020-12-09

### Added

- Support syntax highlighting for Go Template embedded in literal string in Go source file.
- Support syntax highlighting for Go Template files: `*.gtpl`.

## [0.0.1] - 2020-09-09

### Added

- Support syntax highlighting for Go Template files: `*.go.txt`, `*.go.tpl`, `*.go.tmpl`.
- Support syntax highlighting for Go Template embedded in `HTML`, `JS`, and `CSS` files.
- Support syntax highlighting for Go Template embedded in unknown extension files which begin with `{{ /* Go Template */ }}`.
