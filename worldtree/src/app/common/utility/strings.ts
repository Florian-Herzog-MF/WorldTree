export function isNullOrEmpty(string: string | null | undefined) {
  return string == null || string.length === 0;
}
