import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';
import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider from '../../GoTemplateSemanticTokensProvider';
import TokenType from '../../tokenType';

chai.use(assertArrays);

suite('Parse Builtin', () => {
  let provider: GoTemplateSemanticTokensProvider;

  suiteSetup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    provider = new GoTemplateSemanticTokensProvider();
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  test('Parse builtin-functions', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: `
        {{and .X .Y}}
        {{call .X.Y 1 2}}
        {{html "<script>alert(1);</script>"}}
        {{index .X 1 2 3}}
        {{slice .X 1 2}}
        {{js .X}}
        {{len .X}}
        {{not .X}}
        {{or .X .Y}}
        {{print .X}}
        {{printf "%d" .X}}
        {{println .X}}
        {{urlquery "a&b"}}
        {{eq .X .Y}}
        {{ne .X .Y}}
        {{lt .X .Y}}
        {{le .X .Y}}
        {{gt .X .Y}}
        {{ge .X .Y}}
      `,
    });
    const tokens = await provider.provideDocumentSemanticTokens(doc);
    expect(tokens?.data).to.be.an.instanceOf(Uint32Array);
    // prettier-ignore
    expect(tokens?.data).to.be.equalTo([
      // {{and .X .Y}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 3, TokenType.builtin, 0,
      0, 4, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{call .X.Y 1 2}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 4, TokenType.builtin, 0,
      0, 5, 2, TokenType.property, 0,
      0, 2, 2, TokenType.property, 0,
      0, 6, 2, TokenType.end, 0,
      // {{html "<script>alert(1);</script>"}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 4, TokenType.builtin, 0,
      0, 5, 28, TokenType.string, 0,
      0, 28, 2, TokenType.end, 0,
      // {{index .X 1 2 3}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 5, TokenType.builtin, 0,
      0, 6, 2, TokenType.property, 0,
      0, 8, 2, TokenType.end, 0,
      // {{slice .X 1 2}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 5, TokenType.builtin, 0,
      0, 6, 2, TokenType.property, 0,
      0, 6, 2, TokenType.end, 0,
      // {{js .X}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 2, TokenType.builtin, 0,
      0, 3, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{len .X}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 3, TokenType.builtin, 0,
      0, 4, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{not .X}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 3, TokenType.builtin, 0,
      0, 4, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{or .X .Y}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 2, TokenType.builtin, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{print .X}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 5, TokenType.builtin, 0,
      0, 6, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{printf "%d" .X}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 6, TokenType.builtin, 0,
      0, 7, 1, TokenType.string, 0,
      0, 1, 2, TokenType.placeholder, 0,
      0, 2, 1, TokenType.string, 0,
      0, 2, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{println .X}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 7, TokenType.builtin, 0,
      0, 8, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{urlquery "a&b"}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 8, TokenType.builtin, 0,
      0, 9, 5, TokenType.string, 0,
      0, 5, 2, TokenType.end, 0,
      // {{eq .X .Y}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 2, TokenType.builtin, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{ne .X .Y}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 2, TokenType.builtin, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{lt .X .Y}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 2, TokenType.builtin, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{le .X .Y}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 2, TokenType.builtin, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{gt .X .Y}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 2, TokenType.builtin, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
      // {{ge .X .Y}}
      1, 8, 2, TokenType.begin, 0,
      0, 2, 2, TokenType.builtin, 0,
      0, 3, 2, TokenType.property, 0,
      0, 3, 2, TokenType.property, 0,
      0, 2, 2, TokenType.end, 0,
    ]);
  });
});
