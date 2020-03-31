export default function t9(number: string): string[] {
  const numbersMap: Record<string, string[]> = {
    '2': ['a', 'b', 'c'],
    '3': ['d', 'e', 'f'],
    '4': ['g', 'h', 'i'],
    '5': ['j', 'k', 'l'],
    '6': ['m', 'n', 'o'],
    '7': ['p', 'q', 'r', 's'],
    '8': ['t', 'u', 'v'],
    '9': ['w', 'x', 'y', 'z'],
  };

  const charFromNumber: (number: string) => string[] = number => numbersMap[number.toString()];

  const combine: (allCombos: string[], chars: string[]) => string[] = (allCombos, chars) => {
    // NOTE: not sure what to do when 0 or 1, so let's just skip them
    if (chars === undefined) {
      return allCombos;
    }
    if (!allCombos.length) {
      return chars;
    }

    return allCombos.reduce((combos, nextCombo) => combos.concat(chars.map(char => nextCombo + char)), [] as string[]);
  }

  return number
    .split('')
    .reduce((allCombos, nextNumber) => combine(allCombos, charFromNumber(nextNumber)), [] as string[]);
};
