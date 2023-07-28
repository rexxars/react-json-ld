import {encodeJsonLD} from './encode.js'
import type {JsonLDProps} from './types.js'

/**
 * Encode the passed `data` as JSON-LD and return a script element with
 * a safe `innerHTML` property.
 *
 * @param props - Props for the JsonLD component
 * @returns Script element with the JSON-LD data
 * @public
 */
export function JsonLD({data, ...rest}: JsonLDProps) {
  return (
    <script
      type="application/ld+json"
      {...rest}
      dangerouslySetInnerHTML={{__html: encodeJsonLD(data)}}
    />
  )
}
