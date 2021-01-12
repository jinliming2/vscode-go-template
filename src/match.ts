import TokenType from './tokenType';

const control = ['if', 'else', 'range', 'template', 'with', 'end', 'nil', 'with', 'define', 'block'];
// prettier-ignore
const builtin = ['and', 'call', 'html', 'index', 'js', 'len', 'not', 'or', 'print', 'printf', 'println', 'urlquery', 'eq', 'ne', 'lt', 'le', 'gt', 'ge'];

export const regexBegin = /\{\{(-\s)?/g;

const regex = new RegExp(
  `(${[
    '(\\s-)?\\}\\}', // end
    '/\\*', // comment
    '`', // raw string
    '".*?(?<!(?<!\\\\)\\\\)"', // string
    '\\$\\w+', // variable
    ':=', // assignment
    '\\|', // pipe
    '\\.\\w*', // property
    `\\b(${control.join('|')})\\b`, // control
    `\\b(${builtin.join('|')})\\b`, // builtin
    // `\\\\([0-7]{3}|[abfnrtv\\\\'"]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})`, // stringEscape
    // `\\\\[^0-7xuUabfnrtv']`, // unknownEscape
    // '%(\\[\\d+\\])?([\\+#\\-0\\x20]{,2}((\\d+|\\*)?(\\.?(\\d+|\\*|(\\[\\d+\\])\\*?)?(\\[\\d+\\])?)?))?[vT%tbcdoqxXUbeEfFgGspw]', // placeholder
  ].join('|')})`,
  'g',
);

// Always return new copy of RegExp
export default () => new RegExp(regex);

export const isEnd = (m: RegExpExecArray): boolean => m[1].endsWith('}}');
export const isCommentBegin = (m: RegExpExecArray): boolean => m[1] === '/*';
export const isRawStringBegin = (m: RegExpExecArray): boolean => m[1] === '`';
export const matchType = (m: RegExpExecArray): TokenType | undefined => {
  if (m[1].startsWith('"')) {
    return TokenType.string;
  } else if (m[1].startsWith('$')) {
    return TokenType.variable;
  } else if (m[1] === ':=') {
    return TokenType.assignment;
  } else if (m[1] === '|') {
    return TokenType.pipe;
  } else if (m[1].startsWith('.')) {
    return TokenType.property;
  } else if (control.includes(m[1])) {
    return TokenType.control;
  } else if (builtin.includes(m[1])) {
    return TokenType.builtin;
  }
  return;
};
