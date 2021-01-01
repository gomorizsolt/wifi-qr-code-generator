export const isFilledWithEmptySpaces = (value: string) => value.trim() === '';

const charsToEscape = [',', '/', ':', ';'];

export const escapeString = (string: string) => {
  let result = '';

  for (const char of string) {
    if (charsToEscape.includes(char)) {
      result += '\\' + char;
    } else {
      result += char;
    }
  }

  return result;
};
