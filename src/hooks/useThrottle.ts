import { useCallback, useRef, useEffect } from 'react';

/**
 * 节流 Hook
 * @param func 需要节流的函数
 * @param delay 节流时间（毫秒）
 * @param options 配置选项
 * @returns 被节流的函数
 */
function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: {
    leading?: boolean;  // 是否立即执行首次调用
    trailing?: boolean; // 是否在节流结束后执行最后一次调用
  } = { leading: true, trailing: true }
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecTimeRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T>>(null);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const elapsed = now - lastExecTimeRef.current;
    const shouldExecuteLeading = options.leading && elapsed > delay;

    // 立即执行条件判断
    if (shouldExecuteLeading) {
      lastExecTimeRef.current = now;
      func(...args);
    } else {
      lastArgsRef.current = args;
    }

    // 设置延迟执行
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        const shouldExecuteTrailing = options.trailing && lastArgsRef.current;

        if (shouldExecuteTrailing) {
          func(...lastArgsRef.current!);
        }

        lastExecTimeRef.current = Date.now();
        timeoutRef.current = null;
      }, delay - elapsed);
    }
  }, [func, delay, options.leading, options.trailing]);
}

export default useThrottle;