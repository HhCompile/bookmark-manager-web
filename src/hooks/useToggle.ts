/**
 * 切换状态 Hook
 * 用于管理布尔类型的切换状态
 * 
 * 使用示例:
 * const [isOpen, toggleOpen, setOpen] = useToggle(false);
 * 
 * // 切换状态
 * <button onClick={toggleOpen}>切换</button>
 * 
 * // 直接设置
 * <button onClick={() => setOpen(true)}>打开</button>
 * <button onClick={() => setOpen(false)}>关闭</button>
 */

import { useState, useCallback } from 'react';

export function useToggle(
  initialValue = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const set = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, set];
}

/**
 * 多个切换状态管理 Hook
 * 用于管理多个相关的布尔状态
 * 
 * 使用示例:
 * const { isOpen, isLoading, toggleOpen, setLoading } = useToggles({
 *   isOpen: false,
 *   isLoading: false,
 * });
 */

import { useMemo } from 'react';

type ToggleState<T extends Record<string, boolean>> = {
  [K in keyof T]: T[K];
} & {
  [K in keyof T as `toggle${Capitalize<string & K>}`]: () => void;
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: boolean) => void;
};

export function useToggles<T extends Record<string, boolean>>(
  initialState: T
): ToggleState<T> {
  const [state, setState] = useState(initialState);

  const result = useMemo(() => {
    const toggles: Record<string, () => void> = {};
    const setters: Record<string, (value: boolean) => void> = {};

    Object.keys(state).forEach(key => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      
      toggles[`toggle${capitalizedKey}`] = () => {
        setState(prev => ({ ...prev, [key]: !prev[key] }));
      };

      setters[`set${capitalizedKey}`] = (value: boolean) => {
        setState(prev => ({ ...prev, [key]: value }));
      };
    });

    return {
      ...state,
      ...toggles,
      ...setters,
    } as ToggleState<T>;
  }, [state]);

  return result;
}

export default useToggle;
