import * as vscode from 'vscode';
import GoTemplateSemanticTokensProvider, { goTemplateLegend } from './GoTemplateSemanticTokensProvider';
import MarkdownGoTemplateSemanticTokensProvider from './MarkdownGoTemplateSemanticTokensProvider';

const CONFIG_SECTION = 'go-template';

const getConfig = (): { languages: vscode.DocumentFilter[]; patterns: vscode.DocumentFilter[] } => {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
  return {
    languages: (config.get<string[]>('languages') || []).map<vscode.DocumentFilter>(language => ({ language })),
    patterns: (config.get<string[]>('patterns') || []).map<vscode.DocumentFilter>(pattern => ({ pattern })),
  };
};

const registerProvider = (context: vscode.ExtensionContext, selector: vscode.DocumentFilter[]) => {
  let disposable: { dispose(): void } | undefined;
  while ((disposable = context.subscriptions.pop())) {
    disposable.dispose();
  }

  if (selector.length > 0) {
    context.subscriptions.push(
      vscode.languages.registerDocumentSemanticTokensProvider(
        selector,
        new GoTemplateSemanticTokensProvider(),
        goTemplateLegend,
      ),
    );
  }

  context.subscriptions.push(
    vscode.languages.registerDocumentSemanticTokensProvider(
      [{ language: 'markdown' }],
      new MarkdownGoTemplateSemanticTokensProvider(),
      goTemplateLegend,
    ),
  );
};

export const activate = (context: vscode.ExtensionContext): void => {
  const { languages, patterns } = getConfig();
  registerProvider(context, [...languages, ...patterns]);

  vscode.workspace.onDidChangeConfiguration(e => {
    if (!e.affectsConfiguration(CONFIG_SECTION)) {
      return;
    }

    const { languages, patterns } = getConfig();
    registerProvider(context, [...languages, ...patterns]);
  });

  vscode.commands.registerCommand('go-template.reload', () => {
    vscode.window.showInformationMessage('Reloading Go Template Syntax Support.');
    const { languages, patterns } = getConfig();
    registerProvider(context, [...languages, ...patterns]);
  });
};
