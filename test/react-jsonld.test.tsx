import {expect, test} from 'vitest'
import renderer from 'react-test-renderer'
import {JsonLD} from '../src/index.js'
import {
  getDataFromInnerHTMLProp,
  getInnerHTMLProp,
  toHtml,
  toJson,
  validateHtmlSnippet,
} from './helpers/testHelpers.js'

test('renders safe data as-is', async () => {
  const input = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: 'Espen Hovlandsdal',
  }

  const element = <JsonLD data={input} />
  const component = renderer.create(element)
  const output = getDataFromInnerHTMLProp(component)
  expect(output).toStrictEqual(input)

  const props = toJson(component).props
  expect(props.type).toBe('application/ld+json')
  expect(props).not.toHaveProperty('id')
  expect(props).not.toHaveProperty('data-testid')

  const html = toHtml(element)
  expect(await validateHtmlSnippet(html)).toBe(true)
})

test('escapes unsafe data', async () => {
  const input = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: '</script><script>alert("xss")</script>',
  }

  const element = <JsonLD data={input} />
  const component = renderer.create(element)
  const output = getDataFromInnerHTMLProp(component)
  const script = getInnerHTMLProp(component)
  expect(output).toStrictEqual(input)
  expect(script).toBe(
    `{"@context":"https://schema.org/","@type":"Person","name":"\\u003c/script\\u003e\\u003cscript\\u003ealert(\\"xss\\")\\u003c/script\\u003e"}`,
  )

  const html = toHtml(element)
  expect(await validateHtmlSnippet(html)).toBe(true)
})

test('can pass regular script attributes as props', async () => {
  const input = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: 'Dmitry Kalinin',
  }

  const element = <JsonLD data={input} data-testid="testable!" id="my-script" />
  const component = renderer.create(element)
  expect(toJson(component).props).toMatchInlineSnapshot(`
    {
      "dangerouslySetInnerHTML": {
        "__html": "{\\"@context\\":\\"https://schema.org/\\",\\"@type\\":\\"Person\\",\\"name\\":\\"Dmitry Kalinin\\"}",
      },
      "data-testid": "testable!",
      "id": "my-script",
      "type": "application/ld+json",
    }
  `)

  const html = toHtml(element)
  expect(await validateHtmlSnippet(html)).toBe(true)
})
