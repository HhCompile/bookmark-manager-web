import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useBookmarkStore } from '@/store/bookmarkStore'
import UploadPage from '@/pages/UploadPage'

// Mock the store
vi.mock('@/store/bookmarkStore', () => ({
  useBookmarkStore: vi.fn()
}))

// Mock the API
vi.mock('@/services/api', () => ({
  api: {
    uploadBookmarkFile: vi.fn()
  }
}))

describe('UploadPage', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Mock store implementation
    useBookmarkStore.mockImplementation(() => ({
      setLoading: vi.fn(),
      setError: vi.fn(),
      loading: false,
      error: null
    }))
  })

  it('renders upload page title', () => {
    render(<UploadPage />)
    expect(screen.getByText('书签管理器')).toBeInTheDocument()
    expect(screen.getByText('上传并管理您的浏览器书签')).toBeInTheDocument()
  })

  it('shows file selection button', () => {
    render(<UploadPage />)
    expect(screen.getByText('选择文件')).toBeInTheDocument()
  })

  it('handles file selection', async () => {
    render(<UploadPage />)
    
    const file = new File(['dummy content'], 'bookmarks.html', { type: 'text/html' })
    const input = screen.getByLabelText(/选择文件/i)
    
    fireEvent.change(input, { target: { files: [file] } })
    
    expect(screen.getByText('文件已选择')).toBeInTheDocument()
    expect(screen.getByText('bookmarks.html')).toBeInTheDocument()
  })
})