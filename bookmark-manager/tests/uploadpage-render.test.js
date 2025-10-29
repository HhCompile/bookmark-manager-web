import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import UploadPage from '../src/pages/UploadPage'

test('UploadPage renders without crashing', () => {
  render(<UploadPage />)
  expect(true).toBe(true)
})