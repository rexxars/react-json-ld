import {expect, test} from 'vitest'
import {encodeJsonLD} from '../src/index.js'

test('encodes safe data as-is', async () => {
  const input = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: 'Espen Hovlandsdal',
  }

  const json = encodeJsonLD(input)
  expect(json).toBe(JSON.stringify(input))

  const output = JSON.parse(json)
  expect(output).toStrictEqual(input)
})

test('encode unsafe data by escaping', async () => {
  const input = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: '</script><script>alert("xss")</script>',
  }

  const json = encodeJsonLD(input)
  expect(json).not.toContain('<')
  expect(json).not.toContain('>')

  const output = JSON.parse(json)
  expect(output).toStrictEqual(input)
})
