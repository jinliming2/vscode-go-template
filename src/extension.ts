import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider, { goTemplateLegend } from './GoTemplateSemanticTokensProvider';

const CONFIG_SECTION = 'go-template';

const getConfig = (): { languages: vscode.DocumentFilter[]; patterns: vscode.DocumentFilter[] } => {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
  return {
    languages: (config.get<string[]>('languages') || []).map<vscode.DocumentFilter>(language => ({ language })),
    patterns: (config.get<string[]>('patterns') || []).map<vscode.DocumentFilter>(pattern => ({ pattern })),
  };
};

const registerProvider = (context: vscode.ExtensionContext, selector: vscode.DocumentFilter[]) => {
  if (selector.length > 0) {
    context.subscriptions.push(
      vscode.languages.registerDocumentSemanticTokensProvider(
        selector,
        new GoTemplateSemanticTokensProvider(),
        goTemplateLegend,
      ),
    );
  }
};

export const activate = (context: vscode.ExtensionContext) => {
  const { languages, patterns } = getConfig();
  registerProvider(context, [...languages, ...patterns]);

  vscode.workspace.onDidChangeConfiguration(e => {
    if (!e.affectsConfiguration(CONFIG_SECTION)) {
      return;
    }

    let disposable: { dispose(): any } | undefined;
    while ((disposable = context.subscriptions.pop())) {
      disposable.dispose();
    }

    const { languages, patterns } = getConfig();
    registerProvider(context, [...languages, ...patterns]);
  });
};
