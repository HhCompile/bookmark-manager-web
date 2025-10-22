import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import UploadPage from '../src/pages/UploadPage'

test('UploadPage imports correctly', () => {
  expect(UploadPage).toBeDefined()
})