import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Variable Assignment', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse initialize a variable', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{{ $var := "value" }}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 0, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.variable, 0,
      0, 5, 2, TokenType.assignment, 0,
      0, 3, 7, TokenType.string, 0,
      0, 8, 2, TokenType.end, 0,
    ]);
  });

  test('Parse assign variable', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{{- $variable = "value" -}}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 0, 4, TokenType.begin, 0,
      0, 4, 9, TokenType.variable, 0,
      0, 10, 1, TokenType.assignment, 0,
      0, 2, 7, TokenType.string, 0,
      0, 7, 4, TokenType.end, 0,
    ]);
  });

  test('Parse range-value', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{{- range $index, $element := .Value }}xxx{{ end -}}',
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      0, 0, 4, TokenType.begin, 0,
      0, 4, 5, TokenType.control, 0,
      0, 6, 6, TokenType.variable, 0,
      0, 8, 8, TokenType.variable, 0,
      0, 9, 2, TokenType.assignment, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      0, 5, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 3, 4, TokenType.end, 0,
    ]);
  });
});
