function parseQueryToIntegerArray(
  query: string | string[] | undefined,
): number[] {
  const parsed: number[] = [];
  if (Array.isArray(query)) {
    query.forEach((value) => {
      const n = parseInt(value);
      if (n) {
        parsed.push(n);
      }
    });
  } else {
    const n = parseInt(query as string);
    if (n) {
      parsed.push(n);
    }
  }

  return parsed;
}

export { parseQueryToIntegerArray };
