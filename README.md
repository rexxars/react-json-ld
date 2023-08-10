# react-json-ld

[![npm version](https://img.shields.io/npm/v/react-json-ld.svg?style=flat-square)](https://www.npmjs.com/package/react-json-ld)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-json-ld?style=flat-square)](https://bundlephobia.com/result?p=react-json-ld)[![npm weekly downloads](https://img.shields.io/npm/dw/react-json-ld.svg?style=flat-square)](https://www.npmjs.com/package/react-json-ld)

React component that renders a `<script type="application/ld+json">` tag with your passed [JSON-LD](https://json-ld.org/) data, in a way that prevents [Cross-Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/) attacks.

This differs from other implementations in that it escapes dangerous characters in the JSON data with unicode escape sequences (`\uXXXX`), rather than HTML entities (`&lt;`, `&gt;` etc). This means the data does not need to be "decoded" beyond simply JSON parsing it, which is more cross-platform friendly.

## Installation

```bash
npm install --save react-json-ld
```

## Usage

```tsx
import {JsonLD, type JsonLDData} from 'react-json-ld'

const structuredData: JsonLDData = {
  '@context': 'https://schema.org/',
  '@type': 'Person',
  name: 'Espen Hovlandsdal',
}

function MyComponent() {
  return (
    <head>
      <JsonLd data={structuredData} />
    </head>
  )
}
```

## Alternative usage

```tsx
import {encodeJsonLD, type JsonLDData} from 'react-json-ld'

const structuredData: JsonLDData = {
  '@context': 'https://schema.org/',
  '@type': 'Person',
  name: 'Dmitry Kalinin',
}

const encodedData = encodeJsonLD(structuredData)

function MyComponent() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: encodedData}}
    />
  )
}
```

## Isn't JSON data safe by default?

Kind of! But **not** when you put JSON inside of HTML, necessarily. In particular, putting HTML inside of JSON is totally legal, but can lead to big security issues. Consider the following:

<!-- prettier-ignore -->
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Person",
  "name": "👋 Attacker here </script><script>alert('I see a problem')",
}
</script>
```

This will be interpreted as an invalid JSON-LD object, which the browser ignores, but it also opens up a new script tag and executes the JavaScript contained there. If you are using data from an untrusted source (such as user-contributed content), this can be a big problem.

This library attempts to solve this problem, by escaping the JSON data in a way that makes it safe to put inside of HTML. The above example would be escaped to:

<!-- prettier-ignore -->
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Person",
  "name": "👋 Attacker here \u003c/script\u003eu003cscriptu003ealert('I see a problem')",
}
</script>
```

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
