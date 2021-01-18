import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Template', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse template', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{{template "name"}}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 0, 2, TokenType.begin, 0,
      0, 2, 8, TokenType.control, 0,
      0, 9, 6, TokenType.string, 0,
      0, 6, 2, TokenType.end, 0,
    ]);
  });

  test('Parse template-pipeline', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{{template "name" .Value}}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 0, 2, TokenType.begin, 0,
      0, 2, 8, TokenType.control, 0,
      0, 9, 6, TokenType.string, 0,
      0, 7, 6, TokenType.property, 0,
      0, 6, 2, TokenType.end, 0,
    ]);
  });
});
