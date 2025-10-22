// Simple test to verify debugging tools
import { test, expect } from 'vitest'
import { debug } from '../src/lib/debug'

test('debug function exists', () => {
  expect(debug).toBeDefined()
  expect(typeof debug).toBe('function')
})

test('debug function does not throw errors', () => {
  expect(() => {
    debug('test message')
  }).not.toThrow()
})