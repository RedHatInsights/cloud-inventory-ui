import { useCallback, useEffect, useRef, useState } from 'react';

export const useDebouncedState = <T>(
  defaultValue: T,
  delay: number,
): readonly [T, (nextValue: T) => void] => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [value, setValue] = useState<T>(defaultValue);
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
  const setDebouncedValue = useCallback(
    (nextValue: T) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        setValue(nextValue);
      }, delay);
    },
    [delay],
  );
  return [value, setDebouncedValue] as const;
};
