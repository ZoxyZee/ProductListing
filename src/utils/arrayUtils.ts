export function findDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();

  arr.forEach(item => {
    if (seen.has(item)) {
      duplicates.add(item);
      return;
    }

    seen.add(item);
  });

  return Array.from(duplicates);
}
