import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse If-Else', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse if-end', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{ if .Value }}
          xxxx
            xxxx
          xxx
        {{ end }}
        {{- if .Value }} xxx {{ end -}}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 3, 2, TokenType.control, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      4, 8, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
      1, 8, 4, TokenType.begin, 0,
      0, 4, 2, TokenType.control, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      0, 7, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 3, 4, TokenType.end, 0,
    ]);
  });

  test('Parse if-elseif-else-end', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{ if .Value }}
          xxx
            xxxx
          xxxx
        {{ else if $value }}
          xxx
            xxxx
          xxx
        {{ else }}
          xxx
            xxx
          xxx
        {{ end }}
        {{ if .Value }} xxxx {{ else if $value }} xxx {{ else }} xxx {{ end }}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 3, 2, TokenType.control, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      4, 8, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.control, 0,
      0, 5, 2, TokenType.control, 0,
      0, 3, 6, TokenType.variable, 0,
      0, 7, 2, TokenType.end, 0,
      4, 8, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.control, 0,
      0, 5, 2, TokenType.end, 0,
      4, 8, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
      1, 8, 2, TokenType.begin, 0,
      0, 3, 2, TokenType.control, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      0, 8, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.control, 0,
      0, 5, 2, TokenType.control, 0,
      0, 3, 6, TokenType.variable, 0,
      0, 7, 2, TokenType.end, 0,
      0, 7, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.control, 0,
      0, 5, 2, TokenType.end, 0,
      0, 7, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
    ]);
  });
});
