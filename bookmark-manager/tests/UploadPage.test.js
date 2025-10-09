// tests/UploadPage.test.js
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UploadPage from '../src/pages/UploadPage'

// Mock the store
vi.mock('../src/store/bookmarkStore', () => ({
  useBookmarkStore: () => ({
    setLoading: vi.fn(),
    setError: vi.fn(),
    loading: false,
    error: null
  })
}))

// Mock the API
vi.mock('../src/services/api', () => ({
  api: {
    uploadBookmarkFile: vi.fn()
  }
}))

describe('UploadPage', () => {
  it('renders upload page correctly', () => {
    render(<UploadPage />)
    
    expect(screen.getByText('书签管理器')).toBeInTheDocument()
    expect(screen.getByText('上传书签文件')).toBeInTheDocument()
  })

  it('shows file selection button', () => {
    render(<UploadPage />)
    
    const button = screen.getByText('选择文件')
    expect(button).toBeInTheDocument()
  })
})