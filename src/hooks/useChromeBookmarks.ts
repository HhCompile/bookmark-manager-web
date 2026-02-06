import { useState, useCallback, useEffect } from 'react';

// 声明 chrome 全局变量
declare global {
  interface Window {
    chrome?: {
      bookmarks?: {
        getTree: (callback: (tree: ChromeBookmark[]) => void) => void;
        get: (
          idOrIdList: string | string[],
          callback: (results: ChromeBookmark[]) => void
        ) => void;
        getChildren: (
          id: string,
          callback: (children: ChromeBookmark[]) => void
        ) => void;
        getRecent: (
          numberOfItems: number,
          callback: (results: ChromeBookmark[]) => void
        ) => void;
        getSubTree: (
          id: string,
          callback: (results: ChromeBookmark[]) => void
        ) => void;
        create: (
          bookmark: {
            title?: string;
            url?: string;
            parentId?: string;
            index?: number;
          },
          callback?: (newBookmark: ChromeBookmark) => void
        ) => void;
        update: (
          id: string,
          changes: { title?: string; url?: string },
          callback?: (updatedBookmark: ChromeBookmark) => void
        ) => void;
        remove: (id: string, callback?: () => void) => void;
      };
      runtime?: {
        lastError?: {
          message: string;
        };
      };
    };
  }

  var chrome:
    | {
        bookmarks?: {
          getTree: (callback: (tree: ChromeBookmark[]) => void) => void;
          get: (
            idOrIdList: string | string[],
            callback: (results: ChromeBookmark[]) => void
          ) => void;
          getChildren: (
            id: string,
            callback: (children: ChromeBookmark[]) => void
          ) => void;
          getRecent: (
            numberOfItems: number,
            callback: (results: ChromeBookmark[]) => void
          ) => void;
          getSubTree: (
            id: string,
            callback: (results: ChromeBookmark[]) => void
          ) => void;
          create: (
            bookmark: {
              title?: string;
              url?: string;
              parentId?: string;
              index?: number;
            },
            callback?: (newBookmark: ChromeBookmark) => void
          ) => void;
          update: (
            id: string,
            changes: { title?: string; url?: string },
            callback?: (updatedBookmark: ChromeBookmark) => void
          ) => void;
          remove: (id: string, callback?: () => void) => void;
        };
        runtime?: {
          lastError?: {
            message: string;
          };
        };
      }
    | undefined;
}

// 定义书签类型
export interface ChromeBookmark {
  id: string;
  parentId?: string;
  index: number;
  url?: string;
  title: string;
  dateAdded: number;
  dateGroupModified?: number;
  children?: ChromeBookmark[];
  iconUrl?: string;
}

// 定义 hook 返回类型
interface UseChromeBookmarksReturn {
  bookmarks: ChromeBookmark[];
  isLoading: boolean;
  error: Error | null;
  // 核心方法
  refreshBookmarks: () => Promise<void>;
  getBookmarkById: (id: string) => ChromeBookmark | undefined;
  // Chrome.bookmarks API 方法
  getBookmark: (idOrIdList: string | string[]) => Promise<ChromeBookmark[]>;
  getChildren: (id: string) => Promise<ChromeBookmark[]>;
  getRecent: (numberOfItems: number) => Promise<ChromeBookmark[]>;
  getSubTree: (id: string) => Promise<ChromeBookmark[]>;
  createBookmark: (bookmark: {
    title?: string;
    url?: string;
    parentId?: string;
    index?: number;
  }) => Promise<ChromeBookmark>;
  updateBookmark: (
    id: string,
    changes: { title?: string; url?: string }
  ) => Promise<ChromeBookmark>;
  removeBookmark: (id: string) => Promise<void>;
}

/**
 * 读取 Chrome 书签的 Hook
 * 注意：此 Hook 只能在 Chrome 扩展环境中使用
 */
export const useChromeBookmarks = (): UseChromeBookmarksReturn => {
  const [bookmarks, setBookmarks] = useState<ChromeBookmark[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // 检查是否在 Chrome 扩展环境中
  const isChromeExtension = useCallback(() => {
    return typeof chrome !== 'undefined' && chrome.bookmarks;
  }, []);

  // 读取所有书签
  const refreshBookmarks = useCallback(async () => {
    if (!isChromeExtension()) {
      setError(new Error('此功能只能在 Chrome 扩展环境中使用'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 使用 Chrome 书签 API 读取根书签
      const rootBookmarks = await new Promise<ChromeBookmark[]>(
        (resolve, reject) => {
          chrome?.bookmarks?.getTree((tree) => {
            if (chrome?.runtime?.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(tree);
            }
          });
        }
      );

      setBookmarks(rootBookmarks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('读取书签失败'));
    } finally {
      setIsLoading(false);
    }
  }, [isChromeExtension]);

  // 根据 ID 获取书签
  const getBookmarkById = useCallback(
    (id: string): ChromeBookmark | undefined => {
      const findBookmark = (
        bookmarks: ChromeBookmark[]
      ): ChromeBookmark | undefined => {
        for (const bookmark of bookmarks) {
          if (bookmark.id === id) {
            return bookmark;
          }
          if (bookmark.children) {
            const found = findBookmark(bookmark.children);
            if (found) {
              return found;
            }
          }
        }
        return undefined;
      };

      return findBookmark(bookmarks);
    },
    [bookmarks]
  );

  // 根据 ID 获取书签（使用 Chrome API）
  const getBookmark = useCallback(
    async (idOrIdList: string | string[]): Promise<ChromeBookmark[]> => {
      if (!isChromeExtension()) {
        throw new Error('此功能只能在 Chrome 扩展环境中使用');
      }

      return new Promise<ChromeBookmark[]>((resolve, reject) => {
        chrome?.bookmarks?.get(idOrIdList, (results) => {
          if (chrome?.runtime?.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(results);
          }
        });
      });
    },
    [isChromeExtension]
  );

  // 获取书签文件夹的子节点
  const getChildren = useCallback(
    async (id: string): Promise<ChromeBookmark[]> => {
      if (!isChromeExtension()) {
        throw new Error('此功能只能在 Chrome 扩展环境中使用');
      }

      return new Promise<ChromeBookmark[]>((resolve, reject) => {
        chrome?.bookmarks?.getChildren(id, (children) => {
          if (chrome?.runtime?.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(children);
          }
        });
      });
    },
    [isChromeExtension]
  );

  // 获取最近添加的书签
  const getRecent = useCallback(
    async (numberOfItems: number): Promise<ChromeBookmark[]> => {
      if (!isChromeExtension()) {
        throw new Error('此功能只能在 Chrome 扩展环境中使用');
      }

      return new Promise<ChromeBookmark[]>((resolve, reject) => {
        chrome?.bookmarks?.getRecent(numberOfItems, (results) => {
          if (chrome?.runtime?.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(results);
          }
        });
      });
    },
    [isChromeExtension]
  );

  // 获取书签子树
  const getSubTree = useCallback(
    async (id: string): Promise<ChromeBookmark[]> => {
      if (!isChromeExtension()) {
        throw new Error('此功能只能在 Chrome 扩展环境中使用');
      }

      return new Promise<ChromeBookmark[]>((resolve, reject) => {
        chrome?.bookmarks?.getSubTree(id, (results) => {
          if (chrome?.runtime?.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(results);
          }
        });
      });
    },
    [isChromeExtension]
  );

  // 创建书签
  const createBookmark = useCallback(
    async (bookmark: {
      title?: string;
      url?: string;
      parentId?: string;
      index?: number;
    }): Promise<ChromeBookmark> => {
      if (!isChromeExtension()) {
        throw new Error('此功能只能在 Chrome 扩展环境中使用');
      }

      return new Promise<ChromeBookmark>((resolve, reject) => {
        chrome?.bookmarks?.create(bookmark, (newBookmark) => {
          if (chrome?.runtime?.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else if (newBookmark) {
            resolve(newBookmark);
          } else {
            reject(new Error('创建书签失败'));
          }
        });
      });
    },
    [isChromeExtension]
  );

  // 更新书签
  const updateBookmark = useCallback(
    async (
      id: string,
      changes: { title?: string; url?: string }
    ): Promise<ChromeBookmark> => {
      if (!isChromeExtension()) {
        throw new Error('此功能只能在 Chrome 扩展环境中使用');
      }

      return new Promise<ChromeBookmark>((resolve, reject) => {
        chrome?.bookmarks?.update(id, changes, (updatedBookmark) => {
          if (chrome?.runtime?.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else if (updatedBookmark) {
            resolve(updatedBookmark);
          } else {
            reject(new Error('更新书签失败'));
          }
        });
      });
    },
    [isChromeExtension]
  );

  // 删除书签
  const removeBookmark = useCallback(
    async (id: string): Promise<void> => {
      if (!isChromeExtension()) {
        throw new Error('此功能只能在 Chrome 扩展环境中使用');
      }

      return new Promise<void>((resolve, reject) => {
        chrome?.bookmarks?.remove(id, () => {
          if (chrome?.runtime?.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      });
    },
    [isChromeExtension]
  );

  // 初始化时读取书签
  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  return {
    bookmarks,
    isLoading,
    error,
    refreshBookmarks,
    getBookmarkById,
    // Chrome.bookmarks API 方法
    getBookmark,
    getChildren,
    getRecent,
    getSubTree,
    createBookmark,
    updateBookmark,
    removeBookmark,
  };
};

/**
 * 导出一个辅助函数，用于扁平化书签树
 */
export const flattenBookmarks = (
  bookmarks: ChromeBookmark[]
): ChromeBookmark[] => {
  const result: ChromeBookmark[] = [];

  const traverse = (items: ChromeBookmark[]) => {
    for (const item of items) {
      result.push(item);
      if (item.children) {
        traverse(item.children);
      }
    }
  };

  traverse(bookmarks);
  return result;
};

/**
 * 导出一个辅助函数，用于获取所有书签 URL
 */
export const getAllBookmarkUrls = (bookmarks: ChromeBookmark[]): string[] => {
  const urls: string[] = [];

  const traverse = (items: ChromeBookmark[]) => {
    for (const item of items) {
      if (item.url) {
        urls.push(item.url);
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  };

  traverse(bookmarks);
  return urls;
};
