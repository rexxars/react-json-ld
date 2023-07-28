import {expect} from 'vitest'
import renderer from 'react-test-renderer'
import {ReactElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import type {JsonLDData} from '../../src/types.js'

export function toJson(
  component: renderer.ReactTestRenderer,
): renderer.ReactTestRendererJSON {
  const result = component.toJSON()
  expect(result).toBeDefined()
  expect(result).not.toBeInstanceOf(Array)
  return result as renderer.ReactTestRendererJSON
}

export function toHtml(el: JSX.Element | ReactElement): string {
  return renderToStaticMarkup(el)
}

export function getInnerHTMLProp(
  component: renderer.ReactTestRenderer,
): string {
  const result = component.toJSON()
  expect(result).toBeDefined()
  expect(result).not.toBeInstanceOf(Array)
  expect(result).toHaveProperty('props.dangerouslySetInnerHTML.__html')

  if (!result || Array.isArray(result)) {
    throw new Error('Invalid result')
  }

  return result.props.dangerouslySetInnerHTML.__html
}

export function getDataFromInnerHTMLProp(
  component: renderer.ReactTestRenderer,
): JsonLDData {
  const result = component.toJSON()
  expect(result).toBeDefined()
  expect(result).not.toBeInstanceOf(Array)
  expect(result).toHaveProperty('props.dangerouslySetInnerHTML.__html')

  if (!result || Array.isArray(result)) {
    throw new Error('Invalid result')
  }

  return JSON.parse(result.props.dangerouslySetInnerHTML.__html)
}

export {validateHtmlSnippet} from './validateHtmlSnippet'
