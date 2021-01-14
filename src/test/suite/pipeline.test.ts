import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Pipeline', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse field of data', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{ .Field }}
        {{ .Field1.Field2 }}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      1, 8, 2, TokenType.begin, 0,
      0, 3, 7, TokenType.property, 0,
      0, 7, 7, TokenType.property, 0,
      0, 8, 2, TokenType.end, 0,
    ]);
  });

  test('Parse variables', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{ $variable }}
        {{ $variable.Field }}
        {{ $variable.Field1.Field2 }}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 3, 9, TokenType.variable, 0,
      0, 10, 2, TokenType.end, 0,
      1, 8, 2, TokenType.begin, 0,
      0, 3, 9, TokenType.variable, 0,
      0, 9, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      1, 8, 2, TokenType.begin, 0,
      0, 3, 9, TokenType.variable, 0,
      0, 9, 7, TokenType.property, 0,
      0, 7, 7, TokenType.property, 0,
      0, 8, 2, TokenType.end, 0,
    ]);
  });

  test('Parse function / method call', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{ or .A .B }}
        {{ .Method .C .D }}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 3, 2, TokenType.builtin, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.end, 0,
      1, 8, 2, TokenType.begin, 0,
      0, 3, 7, TokenType.property, 0,
      0, 8, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.end, 0,
    ]);
  });
});
