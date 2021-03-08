import GoTemplateSemanticTokensProvider, { ParsedToken } from './GoTemplateSemanticTokensProvider';

export default class MarkdownGoTemplateSemanticTokensProvider extends GoTemplateSemanticTokensProvider {
  protected parseSource(source: string, eol: string): ParsedToken[] {
    const result: ParsedToken[] = [];

    const matcher = /^([\t ]*)(`{3,}|~{3,})[\t ]*[^`~\t ]+[\t ]+(?:[^`~]+[\t ]+)?go-template(?:[\t ]+[^`~\r\n]*)?$/gim;
    let match;

    while ((match = matcher.exec(source))) {
      const endMatcher = new RegExp(`^(?:${match[1]}|[\\t ]{0,3})${match[2]}[\\t ]*$`, 'gim');
      endMatcher.lastIndex = matcher.lastIndex;
      const endMatch = endMatcher.exec(source);
      if (!endMatch) {
        break;
      }
      const subSource = source.substring(matcher.lastIndex, endMatch.index);
      const lineOffset = source.substring(0, matcher.lastIndex).split(eol).length - 1;
      result.push(...super.parseSource(subSource, eol).map(t => ({ ...t, line: t.line + lineOffset })));
    }

    return result;
  }
}
