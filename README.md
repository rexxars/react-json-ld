# react-jsonld

[![npm version](https://img.shields.io/npm/v/react-jsonld.svg?style=flat-square)](https://www.npmjs.com/package/react-jsonld)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-jsonld?style=flat-square)](https://bundlephobia.com/result?p=react-jsonld)[![npm weekly downloads](https://img.shields.io/npm/dw/react-jsonld.svg?style=flat-square)](https://www.npmjs.com/package/react-jsonld)

React component that renders a `<script type="application/ld+json">` tag with your passed [JSON-LD](https://json-ld.org/) data, in a way that prevents [Cross-Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/) attacks.

This differs from other implementations in that it escapes dangerous characters in the JSON data with unicode escape sequences (`\uXXXX`), rather than HTML entities (`&lt;`, `&gt;` etc). This means the data does not need to be "decoded" beyond simply JSON parsing it, which is more cross-platform friendly.

## Installation

```bash
npm install --save react-jsonld
```

## Usage

```tsx
import {JsonLD, type JsonLDData} from 'react-jsonld'

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
import {encodeJsonLD, type JsonLDData} from 'react-jsonld'

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

## Migrate from 1.x to 2.x

`JsonLD` is now a named export, not the default export:

```diff
- import JsonLD from 'react-jsonld'
+ import {JsonLD} from 'react-jsonld'
```

## Credits

Thanks to [Dmitry Kalinin](https://github.com/null-none) for the package name on npm and the original version!

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
