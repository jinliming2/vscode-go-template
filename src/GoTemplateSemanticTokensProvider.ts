import * as vscode from 'vscode';
import TokenType from './tokenType';
import regex, { isCommentBegin, isEnd, isRawStringBegin, matchType, regexBegin, stringEscapeMatchList } from './match';

export type ParsedToken = {
  line: number;
  begin: number;
  length: number;
  type: TokenType;
};

const enum2Keys = (e: Record<string | number, string | number>) =>
  Object.values(e).filter(t => typeof t !== 'number') as string[];

export const goTemplateLegend: vscode.SemanticTokensLegend = new vscode.SemanticTokensLegend(enum2Keys(TokenType));

export default class GoTemplateSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
  public provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.ProviderResult<vscode.SemanticTokens> {
    const tokens = this.parseSource(document.getText(), document.eol === vscode.EndOfLine.LF ? '\n' : '\r\n');
    const builder = new vscode.SemanticTokensBuilder();
    for (const token of tokens) {
      builder.push(token.line, token.begin, token.length, token.type);
    }
    return builder.build();
  }

  protected parseSource(source: string, eol: string): ParsedToken[] {
    const res: ParsedToken[] = [];
    let temp: ParsedToken[] = [];
    enum ContinueType {
      notContinue,
      comment,
      rawString,
    }
    let continuing: ContinueType = ContinueType.notContinue;
    for (const [line, content] of source.split(eol).entries()) {
      regex.lastIndex = 0; // Reset regex
      while (true) {
        // Continue comment or raw string
        if (continuing !== ContinueType.notContinue) {
          const endToken = continuing === ContinueType.comment ? '*/' : '`';
          const type = continuing === ContinueType.comment ? TokenType.comment : TokenType.rawString;
          const end = content.indexOf(endToken);
          if (end < 0) {
            temp.push({ line, begin: 0, length: content.length + eol.length, type });
            break;
          }
          temp.push({ line, begin: 0, length: end + endToken.length, type });
          regex.lastIndex = end + endToken.length;
          continuing = ContinueType.notContinue;
        }
        // Begin of Go Template
        if (temp.length === 0) {
          regexBegin.lastIndex = regex.lastIndex;
          const match = regexBegin.exec(content);
          if (!match) {
            break;
          }
          temp = [{ line, begin: match.index || 0, length: match[0].length, type: TokenType.begin }];
          regex.lastIndex = match.index + match[0].length;
          continue;
        }
        const match = regex.exec(content);
        if (!match) {
          break;
        }
        const begin = match.index;
        const length = match[0].length;
        // Comment or raw, may contains Line-Break
        if (isCommentBegin(match)) {
          continuing = ContinueType.comment;
        } else if (isRawStringBegin(match)) {
          continuing = ContinueType.rawString;
        }
        if (continuing !== ContinueType.notContinue) {
          const endToken = continuing === ContinueType.comment ? '*/' : '`';
          const type = continuing === ContinueType.comment ? TokenType.comment : TokenType.rawString;
          const end = content.indexOf(endToken, begin + 1);
          if (end < 0) {
            // with line break
            temp.push({ line, begin, length: content.length + eol.length - begin, type });
            break;
          }
          // end
          temp.push({ line, begin, length: end + endToken.length - begin, type });
          regex.lastIndex = end + endToken.length;
          continuing = ContinueType.notContinue;
          continue;
        }
        // End of Go Template
        if (isEnd(match)) {
          res.push(...temp, { line, begin, length, type: TokenType.end });
          temp = [];
          continue;
        }
        const type = matchType(match);
        if (type) {
          if (type === TokenType.string) {
            const escapes = this.parseStringEscape(line, begin, match[0]);
            temp.push(...escapes);
          } else {
            temp.push({ line, begin, length, type });
          }
        }
      }
    }
    if (continuing !== ContinueType.notContinue) {
      res.push(...temp);
    }
    return res;
  }

  private parseStringEscape(line: number, offset: number, content: string): ParsedToken[] {
    const res: ParsedToken[] = [];
    for (const { regex, type } of stringEscapeMatchList) {
      regex.lastIndex = 0;
      while (true) {
        const match = regex.exec(content);
        if (!match) {
          break;
        }
        const begin = offset + match.index;
        const length = match[0].length;
        res.push({ line, begin, length, type });
      }
    }
    res.sort((a, b) => (a.begin < b.begin ? -1 : 1));
    let begin = offset;
    const originRes: ParsedToken[] = [];
    for (const r of res) {
      if (r.begin > begin) {
        originRes.push({ line, begin, length: r.begin - begin, type: TokenType.string });
      }
      begin = r.begin + r.length;
    }
    if (begin < offset + content.length) {
      originRes.push({ line, begin, length: offset + content.length - begin, type: TokenType.string });
    }
    return [...res, ...originRes];
  }
}
