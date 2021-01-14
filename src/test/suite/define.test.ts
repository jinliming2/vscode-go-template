import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Define', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse define-end', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{define "name"}}
          xxxx
            xxxx
          xxx
        {{ end }}
        {{- define "name"}} xxx {{end -}}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      1, 8, 2, TokenType.begin, 0,
      0, 2, 6, TokenType.control, 0,
      0, 7, 6, TokenType.string, 0,
      0, 6, 2, TokenType.end, 0,
      4, 8, 2, TokenType.begin, 0,
      0, 3, 3, TokenType.control, 0,
      0, 4, 2, TokenType.end, 0,
      1, 8, 4, TokenType.begin, 0,
      0, 4, 6, TokenType.control, 0,
      0, 7, 6, TokenType.string, 0,
      0, 6, 2, TokenType.end, 0,
      0, 7, 2, TokenType.begin, 0,
      0, 2, 3, TokenType.control, 0,
      0, 3, 4, TokenType.end, 0,
    ]);
  });
});
