import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Pipe', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse value pipe', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: 'xxxxx{{ "value" | print }}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 5, 2, TokenType.begin, 0,
      0, 3, 7, TokenType.string, 0,
      0, 8, 1, TokenType.pipe, 0,
      0, 2, 5, TokenType.builtin, 0,
      0, 6, 2, TokenType.end, 0,
    ]);
  });

  test('Parse multi-pipe', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{{"put" | printf "%s%s" "out" | printf "%q"}}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 0, 2, TokenType.begin, 0,
      0, 2, 5, TokenType.string, 0,
      0, 6, 1, TokenType.pipe, 0,
      0, 2, 6, TokenType.builtin, 0,
      0, 7, 1, TokenType.string, 0,
      0, 1, 2, TokenType.placeholder, 0,
      0, 2, 2, TokenType.placeholder, 0,
      0, 2, 1, TokenType.string, 0,
      0, 2, 5, TokenType.string, 0,
      0, 6, 1, TokenType.pipe, 0,
      0, 2, 6, TokenType.builtin, 0,
      0, 7, 1, TokenType.string, 0,
      0, 1, 2, TokenType.placeholder, 0,
      0, 2, 1, TokenType.string, 0,
      0, 1, 2, TokenType.end, 0,
    ]);
  });
});
