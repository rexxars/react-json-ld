import {fetch} from 'undici'

/**
 * Validate a LD+JSON snippet using the schema.org validator
 *
 * @param snippet - Snippet to validate
 * @returns Promise that resolves to `true` if the snippet is valid
 * @throws If the snippet is invalid
 */
export async function validateHtmlSnippet(snippet: string): Promise<true> {
  const response = await fetch('https://validator.schema.org/validate', {
    body: `html=${encodeURIComponent(snippet)}`,
    method: 'POST',
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en',
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'sec-ch-ua':
        '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      Referer: 'https://validator.schema.org/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  })

  if (!response.ok) {
    if (response.status === 429) {
      // eslint-disable-next-line no-console
      console.warn('[WARN] Markup validation rate limited, skipping')
      return true
    }

    throw new Error(
      `Validator request failed with HTTP ${response.status} ${response.statusText}`,
    )
  }

  let text = await response.text()
  let json: unknown

  // Responses are returned as `application/json`, but contains an odd prefix;
  // `)]}'\n` which needs to be removed before parsing. Given I do not know the
  // origin of the prefix and whether or not it is stable, let's replace anything
  // up to the first `{` character, match until the last `}` character, and keep
  // trying until we have a valid JSON object (or give up).
  do {
    try {
      json = JSON.parse(text)
    } catch (err) {
      const newText = text.replace(/^[\s\S]*?(\{[\s\S]*\})/g, '$1')
      if (newText === text) {
        throw new Error('Unable to parse JSON response from validator')
      }

      // Give it another iteration
      text = newText
    }
  } while (!json)

  if (!isValidatorResponse(json)) {
    throw new Error(`Invalid response from validator:\n${text}`)
  }

  if (json.errors.length === 0) {
    return true
  }

  const errors = json.errors.map((error) => error.errorType).join(', ')
  throw new Error(`Invalid LD+JSON snippet: ${errors}`)
}

/**
 * Response from https://validator.schema.org/validate
 *
 * @internal
 */
interface ValidatorResponse {
  errors: {errorType: string}[]
}

/**
 * Checks if the given response conforms to the `ValidatorResponse` type
 *
 * @param response - Response to check
 * @returns True if valid response, false otherwise
 * @internal
 */
function isValidatorResponse(response: unknown): response is ValidatorResponse {
  return (
    isObject(response) &&
    'errors' in response &&
    Array.isArray(response.errors) &&
    response.errors.every(
      (error) =>
        isObject(error) &&
        'errorType' in error &&
        typeof error.errorType === 'string',
    )
  )
}

/**
 * Checks if given value is an object (eg not null/array)
 *
 * @param value - Value to check
 * @returns True if object, false otherwise
 * @internal
 */
function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
