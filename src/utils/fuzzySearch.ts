export function fuzzySearch<T>(
  items: T[],
  searchTerm: string,
  keys: (keyof T)[]
): T[] {
  const lowercasedTerm = searchTerm.toLowerCase().trim();
  if (lowercasedTerm === "") return items;

  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      if (typeof value === "string" || typeof value === "number") {
        const stringValue = value.toString().toLowerCase();
        return (
          stringValue.includes(lowercasedTerm) ||
          fuzzyMatch(stringValue, lowercasedTerm)
        );
      }
      return false;
    })
  );
}

function fuzzyMatch(str: string, pattern: string): boolean {
  const strLength = str.length;
  const patternLength = pattern.length;
  if (patternLength > strLength) {
    return false;
  }
  if (patternLength === strLength) {
    return str === pattern;
  }

  outer: for (let i = 0, j = 0; i < patternLength; i++) {
    const patternChar = pattern.charAt(i);
    while (j < strLength) {
      if (str.charAt(j++) === patternChar) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
