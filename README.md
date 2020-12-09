# Go Template Syntax Highlight Support for VSCode

[![Launched](https://img.shields.io/badge/VSCode--Go--Template-launched-brightgreen.svg?logo=visual-studio-code)](https://github.com/jinliming2/vscode-go-template)
[![GitHub license](https://img.shields.io/github/license/jinliming2/vscode-go-template.svg)](https://raw.githubusercontent.com/jinliming2/vscode-go-template/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/jinliming2/vscode-go-template.svg)](https://github.com/jinliming2/vscode-go-template/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/jinliming2/vscode-go-template.svg)](https://github.com/jinliming2/vscode-go-template/network)
[![GitHub issues](https://img.shields.io/github/issues/jinliming2/vscode-go-template.svg)](https://github.com/jinliming2/vscode-go-template/issues)

Go Template Syntax Highlight Support for VSCode.

## Release

- **[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=jinliming2.vscode-go-template) / Recommend**
- [GitHub Release](https://github.com/jinliming2/vscode-go-template/releases)

## Features

- Support syntax highlighting for Go Template files: `*.go.txt`, `*.go.tpl`, `*.go.tmpl`, `*.gtpl`.

   ![HTML File](./assets/screenshots/tpl.png)
- Support syntax highlighting for Go Template embedded in `HTML`, `JS`, and `CSS` files.

   ![HTML File](./assets/screenshots/html.png)
- Support syntax highlighting for Go Template embedded in unknown extension files which begin with Go Template Comment. Ex: `{{ /* Go Template */ }}`.

   ![HTML File](./assets/screenshots/comment.png)

## Known Issues

1. Template syntax highlighting in JS and CSS files may cause syntax error.

## Release Notes

## [0.0.2] - 2020-12-09
### Added
- Support syntax highlighting for Go Template embedded in literal string in Go source file.
- Support syntax highlighting for Go Template files: `*.gtpl`.

### 0.0.1 (2020-09-09)

- Support syntax highlighting for Go Template files: `*.go.txt`, `*.go.tpl`, `*.go.tmpl`.
- Support syntax highlighting for Go Template embedded in `HTML`, `JS`, and `CSS` files.
- Support syntax highlighting for Go Template embedded in unknown extension files which begin with `{{ /* Go Template */ }}`.
