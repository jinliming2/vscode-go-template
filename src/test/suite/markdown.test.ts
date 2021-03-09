import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import MarkdownGoTemplateSemanticTokensProvider from '../../MarkdownGoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Markdown', () => {
  let provider: MarkdownGoTemplateSemanticTokensProvider;

  const markdownCodeTag = ['```', '~~~'];

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new MarkdownGoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse go-template language', async () => {
    // go-template language was implemented using textmate
  });

  test('Parse go-template attribute', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `# This is a test

${markdownCodeTag[0]}html
{{ if .Value }} template {{ else }} normal {{ end }} code
${markdownCodeTag[0]}

${markdownCodeTag[1]}html go-template
{{ if .Value }} template {{ else }} normal {{ end }} code
${markdownCodeTag[1]}

${markdownCodeTag[0]}yaml test
{{ if .Value }}
  template
{{ else }}
  normal
{{ end }}
code
${markdownCodeTag[0]}

${markdownCodeTag[0]}yaml test go-template config
{{ if .Value }} template {{ else }} normal {{ end }} code
${markdownCodeTag[0]}

end test
`,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      7, 0, 2, TokenType.begin, 0,
      0, 3, 2, TokenType.control, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      0, 12, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.control, 0,
      0, 5, 2, TokenType.end, 0,
      0, 10, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
      13, 0, 2, TokenType.begin, 0,
      0, 3, 2, TokenType.control, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      0, 12, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.control, 0,
      0, 5, 2, TokenType.end, 0,
      0, 10, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
    ]);
  });
});
