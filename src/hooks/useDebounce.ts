/**
 * 防抖 Hook
 * 用于延迟执行频繁触发的操作，如搜索输入
 * 
 * 使用示例:
 * const [searchQuery, setSearchQuery] = useState('');
 * const debouncedQuery = useDebounce(searchQuery, 500);
 * 
 * useEffect(() => {
 *   if (debouncedQuery) {
 *     performSearch(debouncedQuery);
 *   }
 * }, [debouncedQuery]);
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 带防抖的回调 Hook
 * 用于防抖函数调用
 * 
 * 使用示例:
 * const debouncedSearch = useDebouncedCallback(
 *   (query: string) => searchAPI(query),
 *   500
 * );
 */
import { useCallback, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
