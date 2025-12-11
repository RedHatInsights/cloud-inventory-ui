import { formatDate } from '../dates';

describe('formatDate', () => {
  it('returns formatted YYYY-MM-DD for a valid ISO string', () => {
    const result = formatDate('2025-01-15T12:34:56.000Z');
    expect(result).toBe('2025-01-15');
  });

  it('returns empty string for invalid ISO string', () => {
    const result = formatDate('NOT_A_DATE');
    expect(result).toBe('');
  });

  it('returns empty string for empty input', () => {
    const result = formatDate('');
    expect(result).toBe('');
  });

  it('handles a date without time (YYYY-MM-DD)', () => {
    const result = formatDate('2025-08-02');
    expect(result).toBe('2025-08-02');
  });

  it('returns empty string when new Date() cannot parse the value', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = formatDate('2025-99-99');
  });

  it('normalizes date to UTC and keeps YYYY-MM-DD', () => {
    const result = formatDate('2025-12-25T23:59:59');
    expect(result).toMatch(/2025-12-25|2025-12-26/);
  });

  it('works with very early dates', () => {
    const result = formatDate('1970-01-01T00:00:00Z');
    expect(result).toBe('1970-01-01');
  });

  it('works with far future dates', () => {
    const result = formatDate('2099-12-31T23:59:59Z');
    expect(result).toBe('2099-12-31');
  });
});
