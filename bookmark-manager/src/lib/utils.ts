import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { debounce, throttle } from 'lodash-es';

/**
 * 合并Tailwind CSS类名
 * @param inputs 类名数组
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param formatStr 格式化字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd HH:mm'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: zhCN });
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '无效日期';
  }
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounceFn<T extends (...args: any[]) => any>(func: T, wait: number): T {
  return debounce(func, wait) as T;
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @returns 节流后的函数
 */
export function throttleFn<T extends (...args: any[]) => any>(func: T, wait: number): T {
  return throttle(func, wait) as T;
}

/**
 * 深度合并对象
 * @param objects 要合并的对象数组
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, any>>(...objects: T[]): T {
  const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj);
  
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = [...pVal, ...oVal];
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = deepMerge(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    
    return prev;
  }, {} as T);
}