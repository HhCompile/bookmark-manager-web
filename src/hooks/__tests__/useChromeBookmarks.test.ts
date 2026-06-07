import { renderHook, act, waitFor } from '@testing-library/react';
import { useChromeBookmarks, flattenBookmarks, getAllBookmarkUrls } from '../useChromeBookmarks';

// 定义 Chrome 书签类型
interface ChromeBookmark {
  id: string;
  title: string;
  index: number;
  dateAdded: number;
  url?: string;
  children?: ChromeBookmark[];
}

// Mock chrome API
type MockChromeBookmarks = {
  getTree: jest.Mock;
  get: jest.Mock;
  getChildren: jest.Mock;
  getRecent: jest.Mock;
  getSubTree: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  remove: jest.Mock;
};

type MockChromeRuntime = {
  lastError: { message: string } | null | undefined;
};

type GlobalChrome = {
  bookmarks: MockChromeBookmarks;
  runtime: MockChromeRuntime;
};

const mockChromeBookmarks: MockChromeBookmarks = {
  getTree: jest.fn(),
  get: jest.fn(),
  getChildren: jest.fn(),
  getRecent: jest.fn(),
  getSubTree: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockChromeRuntime: MockChromeRuntime = {
  lastError: null,
};

describe('useChromeBookmarks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChromeRuntime.lastError = null;
    
    // Setup chrome mock
    (global as unknown as { chrome?: GlobalChrome }).chrome = {
      bookmarks: mockChromeBookmarks,
      runtime: mockChromeRuntime,
    };
  });

  afterEach(() => {
    const g = global as unknown as { chrome?: GlobalChrome };
    g.chrome = undefined;
    mockChromeRuntime.lastError = null;
  });

  describe('Hook functionality', () => {
    it('should return initial state', () => {
      mockChromeBookmarks.getTree.mockImplementation((callback: (bookmarks: ChromeBookmark[]) => void) => {
        callback([]);
      });

      const { result } = renderHook(() => useChromeBookmarks());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.bookmarks).toEqual([]);
    });

    it('should load bookmarks on mount', async () => {
      const mockBookmarks: ChromeBookmark[] = [
        {
          id: '1',
          title: 'Bookmarks Bar',
          index: 0,
          dateAdded: Date.now(),
          children: [
            {
              id: '2',
              title: 'Google',
              url: 'https://google.com',
              index: 0,
              dateAdded: Date.now(),
            },
          ],
        },
      ];

      mockChromeBookmarks.getTree.mockImplementation((callback: (bookmarks: ChromeBookmark[]) => void) => {
        callback(mockBookmarks);
      });

      const { result } = renderHook(() => useChromeBookmarks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.bookmarks).toEqual(mockBookmarks);
      expect(result.current.error).toBeNull();
    });

    it('should handle error when chrome API fails', async () => {
      mockChromeBookmarks.getTree.mockImplementation((callback: (bookmarks: ChromeBookmark[]) => void) => {
        mockChromeRuntime.lastError = { message: 'Permission denied' };
        callback([]);
      });

      const { result } = renderHook(() => useChromeBookmarks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Permission denied');
    });

    it('should handle non-chrome environment', async () => {
      const g = global as unknown as { chrome?: GlobalChrome };
      g.chrome = undefined;

      const { result } = renderHook(() => useChromeBookmarks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error?.message).toBe('此功能只能在 Chrome 扩展环境中使用');
    });
  });

  describe('getBookmarkById', () => {
    it('should find bookmark by id', async () => {
      const mockBookmarks: ChromeBookmark[] = [
        {
          id: '1',
          title: 'Folder',
          index: 0,
          dateAdded: Date.now(),
          children: [
            {
              id: '2',
              title: 'Google',
              url: 'https://google.com',
              index: 0,
              dateAdded: Date.now(),
            },
          ],
        },
      ];

      mockChromeBookmarks.getTree.mockImplementation((callback: (bookmarks: ChromeBookmark[]) => void) => {
        callback(mockBookmarks);
      });

      const { result } = renderHook(() => useChromeBookmarks());

      await waitFor(() => {
        expect(result.current.bookmarks).toEqual(mockBookmarks);
      });

      // 使用 act 包裹状态更新
      let found: ChromeBookmark | undefined;
      await act(async () => {
        found = result.current.getBookmarkById('2');
      });
      
      expect(found?.title).toBe('Google');
    });

    it('should return undefined for non-existing id', async () => {
      mockChromeBookmarks.getTree.mockImplementation((callback: (bookmarks: ChromeBookmark[]) => void) => {
        callback([]);
      });

      const { result } = renderHook(() => useChromeBookmarks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let found: ChromeBookmark | undefined;
      await act(async () => {
        found = result.current.getBookmarkById('non-existing');
      });
      
      expect(found).toBeUndefined();
    });
  });

  describe('createBookmark', () => {
    it('should create bookmark successfully', async () => {
      const newBookmark: ChromeBookmark = {
        id: '3',
        title: 'New Bookmark',
        url: 'https://example.com',
        index: 0,
        dateAdded: Date.now(),
      };

      mockChromeBookmarks.getTree.mockImplementation((callback: (bookmarks: ChromeBookmark[]) => void) => {
        mockChromeRuntime.lastError = null;
        callback([]);
      });

      mockChromeBookmarks.create.mockImplementation((
        _bookmark: object,
        callback?: (result: ChromeBookmark) => void
      ) => {
        mockChromeRuntime.lastError = null;
        if (callback) callback(newBookmark);
      });

      const { result } = renderHook(() => useChromeBookmarks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let created: ChromeBookmark | undefined;
      await act(async () => {
        created = await result.current.createBookmark({
          title: 'New Bookmark',
          url: 'https://example.com',
        });
      });

      expect(created).toEqual(newBookmark);
    });

    it('should throw error in non-chrome environment', async () => {
      const g = global as unknown as { chrome?: GlobalChrome };
      g.chrome = undefined;

      const { result } = renderHook(() => useChromeBookmarks());

      await expect(
        result.current.createBookmark({ title: 'Test' })
      ).rejects.toThrow('此功能只能在 Chrome 扩展环境中使用');
    });
  });

  describe('updateBookmark', () => {
    it('should update bookmark successfully', async () => {
      const updatedBookmark: ChromeBookmark = {
        id: '1',
        title: 'Updated Title',
        url: 'https://updated.com',
        index: 0,
        dateAdded: Date.now(),
      };

      mockChromeBookmarks.getTree.mockImplementation((callback: (bookmarks: ChromeBookmark[]) => void) => {
        mockChromeRuntime.lastError = null;
        callback([]);
      });

      mockChromeBookmarks.update.mockImplementation((
        _id: string,
        _changes: object,
        callback?: (result: ChromeBookmark) => void
      ) => {
        mockChromeRuntime.lastError = null;
        if (callback) callback(updatedBookmark);
      });

      const { result } = renderHook(() => useChromeBookmarks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let updated: ChromeBookmark | undefined;
      await act(async () => {
        updated = await result.current.updateBookmark('1', {
          title: 'Updated Title',
        });
      });

      expect(updated).toEqual(updatedBookmark);
    });
  });

  describe('removeBookmark', () => {
    it('should remove bookmark successfully', async () => {
      mockChromeBookmarks.getTree.mockImplementation((callback: (bookmarks: ChromeBookmark[]) => void) => {
        mockChromeRuntime.lastError = null;
        callback([]);
      });

      mockChromeBookmarks.remove.mockImplementation((
        _id: string,
        callback?: () => void
      ) => {
        mockChromeRuntime.lastError = null;
        if (callback) callback();
      });

      const { result } = renderHook(() => useChromeBookmarks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.removeBookmark('1');
      });

      expect(mockChromeBookmarks.remove).toHaveBeenCalledWith('1', expect.any(Function));
    });
  });
});

describe('Helper functions', () => {
  describe('flattenBookmarks', () => {
    it('should flatten nested bookmark tree', () => {
      const bookmarks: ChromeBookmark[] = [
        {
          id: '1',
          title: 'Folder 1',
          index: 0,
          dateAdded: Date.now(),
          children: [
            {
              id: '2',
              title: 'Bookmark 1',
              url: 'https://example1.com',
              index: 0,
              dateAdded: Date.now(),
            },
            {
              id: '3',
              title: 'Folder 2',
              index: 1,
              dateAdded: Date.now(),
              children: [
                {
                  id: '4',
                  title: 'Bookmark 2',
                  url: 'https://example2.com',
                  index: 0,
                  dateAdded: Date.now(),
                },
              ],
            },
          ],
        },
      ];

      const flattened = flattenBookmarks(bookmarks);

      expect(flattened.length).toBe(4);
      expect(flattened.map(b => b.id)).toEqual(['1', '2', '3', '4']);
    });

    it('should handle empty array', () => {
      const flattened = flattenBookmarks([]);
      expect(flattened).toEqual([]);
    });
  });

  describe('getAllBookmarkUrls', () => {
    it('should extract all URLs from bookmarks', () => {
      const bookmarks: ChromeBookmark[] = [
        {
          id: '1',
          title: 'Folder',
          index: 0,
          dateAdded: Date.now(),
          children: [
            {
              id: '2',
              title: 'Google',
              url: 'https://google.com',
              index: 0,
              dateAdded: Date.now(),
            },
            {
              id: '3',
              title: 'GitHub',
              url: 'https://github.com',
              index: 1,
              dateAdded: Date.now(),
            },
          ],
        },
      ];

      const urls = getAllBookmarkUrls(bookmarks);

      expect(urls).toEqual(['https://google.com', 'https://github.com']);
    });

    it('should handle bookmarks without URLs (folders)', () => {
      const bookmarks: ChromeBookmark[] = [
        {
          id: '1',
          title: 'Empty Folder',
          index: 0,
          dateAdded: Date.now(),
          children: [],
        },
      ];

      const urls = getAllBookmarkUrls(bookmarks);

      expect(urls).toEqual([]);
    });

    it('should handle empty array', () => {
      const urls = getAllBookmarkUrls([]);
      expect(urls).toEqual([]);
    });
  });
});
