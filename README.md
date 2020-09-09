# Go Template Syntax Highlight Support for VSCode

Go Template Syntax Highlight Support for VSCode.

## Features

- Support syntax highlighting for Go Template files: `*.go.txt`, `*.go.tpl`, `*.go.tmpl`.

   ![HTML File](./assets/screenshots/tpl.png)
- Support syntax highlighting for Go Template embedded in `HTML`, `JS`, and `CSS` files.

   ![HTML File](./assets/screenshots/html.png)
- Support syntax highlighting for Go Template embedded in unknown extension files which begin with Go Template Comment. Ex: `{{ /* Go Template */ }}`.

   ![HTML File](./assets/screenshots/comment.png)

## Known Issues

1. Template syntax highlighting in JS and CSS files may cause syntax error.

## Release Notes

### 0.0.1 (2020-09-09)

- Support syntax highlighting for Go Template files: `*.go.txt`, `*.go.tpl`, `*.go.tmpl`.
- Support syntax highlighting for Go Template embedded in `HTML`, `JS`, and `CSS` files.
- Support syntax highlighting for Go Template embedded in unknown extension files which begin with `{{ /* Go Template */ }}`.
