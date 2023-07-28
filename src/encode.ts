import type {JsonLDData} from './types.js'

/**
 * Encodes an LD+JSON object into a JSON string, with XSS protection.
 *
 * @param data - LD+JSON data to encode
 * @param pretty - Whether to pretty-print the JSON or not
 * @returns Encoded JSON string
 * @public
 */
export function encodeJsonLD(data: JsonLDData, pretty = false): string {
  const encoded = JSON.stringify(data, null, pretty ? 2 : undefined)
  return escapeLdJson(encoded)
}

/**
 * Escapes encoded JSON by replacing `<` and `>` with unicode escapes (`\u003c` and `\u003e`)
 * to prevent XSS. HTML parsers seems to not go into "JSON mode" when encountering LD+JSON, so
 * a closing `</script>` tag will stop/close the script even if it's inside a JSON string.
 * This allows a new script tag to be opened, and an XSS problem is born.
 *
 * @param value - Encoded (stringified) JSON to encode
 * @returns Encoded value
 * @internal
 */
function escapeLdJson(value: string) {
  return value.replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
}
