import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Begin and End', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse begin and end', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '  {{ .Field }}  ',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 2, 2, TokenType.begin, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
    ]);
  });

  test('Parse trimmed begin and end', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '  {{- .Field -}}  ',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 2, 4, TokenType.begin, 0,
      0, 4, 6, TokenType.property, 0,
      0, 6, 4, TokenType.end, 0,
    ]);
  });
});
