import {renderToStaticMarkup} from 'react-dom/server'
import {expect, test} from 'vitest'
import {render} from '@testing-library/react'
import {JsonLD} from '../src/index.js'
import {validateHtmlSnippet} from './helpers/validateHtmlSnippet.js'

test('renders safe data as-is', async () => {
  const input = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: 'Espen Hovlandsdal',
  }

  const element = <JsonLD data={input} data-testid="script" />
  const script = render(element).getByTestId('script')
  expect(script).toHaveTextContent(JSON.stringify(input))

  expect(script).toHaveProperty('type', 'application/ld+json')
  expect(script).toHaveProperty('id', '')

  const html = renderToStaticMarkup(element)
  expect(await validateHtmlSnippet(html)).toBe(true)
})

test('escapes unsafe data', async () => {
  const input = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: '</script><script>alert("xss")</script>',
  }

  const element = <JsonLD data={input} data-testid="unsafe-script" />
  const script = render(element).getByTestId('unsafe-script')

  expect(JSON.parse(script.innerText)).toStrictEqual(input)
  expect(script).toMatchInlineSnapshot(`
    <script
      data-testid="unsafe-script"
      type="application/ld+json"
    >
      {"@context":"https://schema.org/","@type":"Person","name":"\\u003c/script\\u003e\\u003cscript\\u003ealert(\\"xss\\")\\u003c/script\\u003e"}
    </script>
  `)

  const html = renderToStaticMarkup(element)
  expect(await validateHtmlSnippet(html)).toBe(true)
})

test('can pass regular script attributes as props', async () => {
  const input = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: 'Dmitry Kalinin',
  }

  const element = <JsonLD data={input} data-testid="testable" id="my-script" />
  const script = render(element).getByTestId('testable')

  expect(script).toHaveProperty('type', 'application/ld+json')
  expect(script).toHaveProperty('id', 'my-script')

  expect(JSON.parse(script.innerText)).toStrictEqual(input)
  expect(script).toMatchInlineSnapshot(`
    <script
      data-testid="testable"
      id="my-script"
      type="application/ld+json"
    >
      {"@context":"https://schema.org/","@type":"Person","name":"Dmitry Kalinin"}
    </script>
  `)

  const html = renderToStaticMarkup(element)
  expect(await validateHtmlSnippet(html)).toBe(true)
})
