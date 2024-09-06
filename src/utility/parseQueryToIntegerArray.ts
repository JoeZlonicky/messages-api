function parseQueryToIntegerArray(
  query: string | string[] | undefined,
): number[] {
  // If not specified
  if (query === undefined) {
    return [];
  }

  // If specified multiple times
  if (Array.isArray(query)) {
    const parsed: number[] = [];
    query.forEach((value) => {
      const n = parseInt(value);
      if (n) {
        parsed.push(n);
      }
    });
    return parsed;
  }

  // If specified once
  const n = parseInt(query);
  if (n) {
    return [n];
  }

  // If no valid values
  return [];
}

export { parseQueryToIntegerArray };
