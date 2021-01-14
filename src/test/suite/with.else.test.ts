import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse With', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse with-end', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{with "output"}}
        {{- . -}}
        {{ end }}
        {{- with $x := "output" }}{{$x}}{{ end -}}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 2, 4, TokenType.control, 0,
      0, 5, 8, TokenType.string, 0,
      0, 8, 2, TokenType.end, 0,
      1, 8, 4, TokenType.begin, 0,
      0, 4, 1, TokenType.property, 0,
      0, 1, 4, TokenType.end, 0,
      1, 8, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
      1, 8, 4, TokenType.begin, 0,
      0, 4, 4, TokenType.control, 0,
      0, 5, 2, TokenType.variable, 0,
      0, 3, 2, TokenType.assignment, 0,
      0, 3, 8, TokenType.string, 0,
      0, 9, 2, TokenType.end, 0,
      0, 2, 2, TokenType.begin, 0,
      0, 2, 2, TokenType.variable, 0,
      0, 2, 2, TokenType.end, 0,
      0, 2, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 3, 4, TokenType.end, 0,
    ]);
  });

  test('Parse with-else-end', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{with .Data}}
          {{- . -}}
        {{ else }}
          {{- "no data" -}}
        {{ end }}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.Uint32Array();
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 2, 4, TokenType.control, 0,
      0, 5, 5, TokenType.property, 0,
      0, 5, 2, TokenType.end, 0,
      1, 10, 4, TokenType.begin, 0,
      0, 4, 1, TokenType.property, 0,
      0, 1, 4, TokenType.end, 0,
      1, 8, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.control, 0,
      0, 5, 2, TokenType.end, 0,
      1, 10, 4, TokenType.begin, 0,
      0, 4, 9, TokenType.string, 0,
      0, 9, 4, TokenType.end, 0,
      1, 8, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
    ]);
  });
});
