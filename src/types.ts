import type {ScriptHTMLAttributes} from 'react'

/**
 * JSON-LD data
 *
 * Loosely typed on purpose - the full specification allows for so many
 * variations that it is beyond the scope of this project to type it.
 *
 * @public
 */
export interface JsonLDData {
  '@context': unknown
  [key: string]: unknown
}

/**
 * Props for the `JsonLD` component
 *
 * @public
 */
export interface JsonLDProps
  extends Omit<ScriptHTMLAttributes<HTMLScriptElement>, 'src'> {
  /**
   * JSON-LD data
   */
  data: JsonLDData
}
