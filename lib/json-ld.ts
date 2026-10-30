const UNSAFE = /[<>&\u2028\u2029]/g
const ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
}

/**
 * JSON for a `<script type="application/ld+json">` body. Plain JSON.stringify
 * lets a string containing `</script>` close the tag; these escapes keep the
 * output valid JSON that parses to the same value.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(UNSAFE, (c) => ESCAPES[c])
}
