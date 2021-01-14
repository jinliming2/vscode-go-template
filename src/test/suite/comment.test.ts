import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Comment', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse single line comment', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '  {{/* This is single line comment */}}  ',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 2, 2, TokenType.begin, 0,
      0, 2, 33, TokenType.comment, 0,
      0, 33, 2, TokenType.end, 0,
    ]);
  });

  test('Parse multi line comment', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `  {{- /* This is
      multi line
  comment */}}  `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 2, 4, TokenType.begin, 0,
      0, 4, 11, TokenType.comment, 0,
      1, 0, 17, TokenType.comment, 0,
      1, 0, 12, TokenType.comment, 0,
      0, 12, 2, TokenType.end, 0,
    ]);
  });
});
