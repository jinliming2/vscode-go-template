import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse String', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse string', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '  {{"this is string"}}  ',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 2, 2, TokenType.begin, 0,
      0, 2, 16, TokenType.string, 0,
      0, 16, 2, TokenType.end, 0,
    ]);
  });

  test('Parse single line raw string', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '  {{`this is raw string`}}  ',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 2, 2, TokenType.begin, 0,
      0, 2, 20, TokenType.rawString, 0,
      0, 20, 2, TokenType.end, 0,
    ]);
  });

  test('Parse multi line raw string', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `  {{- \` This is
      multi line
  raw string \`}}  `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 2, 4, TokenType.begin, 0,
      0, 4, 10, TokenType.rawString, 0,
      1, 0, 17, TokenType.rawString, 0,
      1, 0, 14, TokenType.rawString, 0,
      0, 14, 2, TokenType.end, 0,
    ]);
  });

  test('Parse string escape', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{{"\\123 \\n\\r\\t \\" \\xFF\\u1234\\U1234ABCD"}}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 0, 2, TokenType.begin, 0,
      0, 2, 1, TokenType.string, 0,
      0, 1, 4, TokenType.stringEscape, 0,
      0, 4, 1, TokenType.string, 0,
      0, 1, 2, TokenType.stringEscape, 0,
      0, 2, 2, TokenType.stringEscape, 0,
      0, 2, 2, TokenType.stringEscape, 0,
      0, 2, 1, TokenType.string, 0,
      0, 1, 2, TokenType.stringEscape, 0,
      0, 2, 1, TokenType.string, 0,
      0, 1, 4, TokenType.stringEscape, 0,
      0, 4, 6, TokenType.stringEscape, 0,
      0, 6, 10, TokenType.stringEscape, 0,
      0, 10, 1, TokenType.string, 0,
      0, 1, 2, TokenType.end, 0,
    ]);
  });

  test('Parse invalid string escape', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{{"abcd\\89\\c\\defgh"}}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 0, 2, TokenType.begin, 0,
      0, 2, 5, TokenType.string, 0,
      0, 5, 2, TokenType.unknownEscape, 0,
      0, 2, 1, TokenType.string, 0,
      0, 1, 2, TokenType.unknownEscape, 0,
      0, 2, 2, TokenType.unknownEscape, 0,
      0, 2, 5, TokenType.string, 0,
      0, 5, 2, TokenType.end, 0,
    ]);
  });

  test('Parse string placeholder', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{{"%s%d%t %[12]s"}}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 0, 2, TokenType.begin, 0,
      0, 2, 1, TokenType.string, 0,
      0, 1, 2, TokenType.placeholder, 0,
      0, 2, 2, TokenType.placeholder, 0,
      0, 2, 2, TokenType.placeholder, 0,
      0, 2, 1, TokenType.string, 0,
      0, 1, 6, TokenType.placeholder, 0,
      0, 6, 1, TokenType.string, 0,
      0, 1, 2, TokenType.end, 0,
    ]);
  });
});
