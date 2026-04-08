import { act, renderHook } from '@testing-library/react';
import { useDebouncedState } from '../useDebouncedState';

describe('useDebouncedState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns the default value initially', () => {
    const { result } = renderHook(() => useDebouncedState('', 400));

    expect(result.current[0]).toBe('');
  });

  it('updates the value after the configured delay', () => {
    const { result } = renderHook(() => useDebouncedState('', 400));

    act(() => {
      result.current[1]('abc');
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(result.current[0]).toBe('abc');
  });

  it('does not update before the full delay has elapsed', () => {
    const { result } = renderHook(() => useDebouncedState('', 400));

    act(() => {
      result.current[1]('abc');
    });

    act(() => {
      jest.advanceTimersByTime(399);
    });

    expect(result.current[0]).toBe('');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current[0]).toBe('abc');
  });

  it('uses the latest value when called multiple times before the delay finishes', () => {
    const { result } = renderHook(() => useDebouncedState('', 400));

    act(() => {
      result.current[1]('a');
      result.current[1]('ab');
      result.current[1]('abc');
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(result.current[0]).toBe('abc');
  });

  it('resets the debounce timer when a new value is set before the delay completes', () => {
    const { result } = renderHook(() => useDebouncedState('', 400));

    act(() => {
      result.current[1]('a');
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    act(() => {
      result.current[1]('ab');
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current[0]).toBe('');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current[0]).toBe('ab');
  });
});
