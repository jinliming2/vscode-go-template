import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Range-Else', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse range-end', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{ range .Value }}
          xxxx
            xxxx
          xxx
        {{ end }}
        {{- range .Value }} xxx {{ end -}}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 3, 5, TokenType.control, 0,
      0, 6, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      4, 8, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
      1, 8, 4, TokenType.begin, 0,
      0, 4, 5, TokenType.control, 0,
      0, 6, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      0, 7, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 3, 4, TokenType.end, 0,
    ]);
  });

  test('Parse range-else-end', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{ range .Value }}
          xxx
            xxxx
          xxxx
        {{ else }}
          xxx
            xxx
          xxx
        {{ end }}
        {{ range $variable }} xxx {{ else }} xxx {{ end }}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 3, 5, TokenType.control, 0,
      0, 6, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      4, 8, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.control, 0,
      0, 5, 2, TokenType.end, 0,
      4, 8, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
      1, 8, 2, TokenType.begin, 0,
      0, 3, 5, TokenType.control, 0,
      0, 6, 9, TokenType.variable, 0,
      0, 10, 2, TokenType.end, 0,
      0, 7, 2, TokenType.begin, 0,
      0, 3, 4, TokenType.control, 0,
      0, 5, 2, TokenType.end, 0,
      0, 7, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
    ]);
  });

  test('Parse range-value', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{ range $index, $element := .Value }}
          xxx
        {{ end }}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 3, 5, TokenType.control, 0,
      0, 6, 6, TokenType.variable, 0,
      0, 8, 8, TokenType.variable, 0,
      0, 9, 2, TokenType.assignment, 0,
      0, 3, 6, TokenType.property, 0,
      0, 7, 2, TokenType.end, 0,
      2, 8, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
    ]);
  });
});
