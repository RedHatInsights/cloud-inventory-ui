import { HttpError, hasPaginationError } from '../errors';
import { PaginationData } from '../../types/pagination';

describe('HttpError', () => {
  it('creates an error with message, status, and statusText', () => {
    const error = new HttpError('Not found', 404, 'Not Found');

    expect(error.message).toBe('Not found');
    expect(error.status).toBe(404);
    expect(error.statusText).toBe('Not Found');
  });

  it('extends Error class', () => {
    const error = new HttpError('Server error', 500, 'Internal Server Error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
  });

  it('handles different HTTP status codes', () => {
    const error401 = new HttpError('Unauthorized', 401, 'Unauthorized');
    const error403 = new HttpError('Forbidden', 403, 'Forbidden');
    const error500 = new HttpError(
      'Server error',
      500,
      'Internal Server Error',
    );

    expect(error401.status).toBe(401);
    expect(error403.status).toBe(403);
    expect(error500.status).toBe(500);
  });

  it('stores custom error messages', () => {
    const customMessage = 'Custom error message for testing';
    const error = new HttpError(customMessage, 400, 'Bad Request');

    expect(error.message).toBe(customMessage);
  });
});

describe('hasPaginationError', () => {
  it('returns false when on first page', () => {
    const pagination: PaginationData = {
      page: 1,
      perPage: 10,
      itemCount: 25,
    };

    expect(hasPaginationError(pagination)).toBe(false);
  });

  it('returns false when current page has items', () => {
    const pagination: PaginationData = {
      page: 2,
      perPage: 10,
      itemCount: 25,
    };

    expect(hasPaginationError(pagination)).toBe(false);
  });

  it('returns false when on last valid page', () => {
    const pagination: PaginationData = {
      page: 3,
      perPage: 10,
      itemCount: 25,
    };

    expect(hasPaginationError(pagination)).toBe(false);
  });

  it('returns true when page exceeds available items', () => {
    const pagination: PaginationData = {
      page: 5,
      perPage: 10,
      itemCount: 25,
    };

    expect(hasPaginationError(pagination)).toBe(true);
  });

  it('returns true when far beyond last page', () => {
    const pagination: PaginationData = {
      page: 100,
      perPage: 10,
      itemCount: 5,
    };

    expect(hasPaginationError(pagination)).toBe(true);
  });

  it('returns true when exactly on boundary', () => {
    const pagination: PaginationData = {
      page: 3,
      perPage: 10,
      itemCount: 20,
    };

    expect(hasPaginationError(pagination)).toBe(true);
  });

  it('handles edge case with zero items', () => {
    const pagination: PaginationData = {
      page: 2,
      perPage: 10,
      itemCount: 0,
    };

    expect(hasPaginationError(pagination)).toBe(true);
  });

  it('returns false when on page one with no data', () => {
    const pagination: PaginationData = {
      page: 1,
      perPage: 10,
      itemCount: 0,
    };

    expect(hasPaginationError(pagination)).toBe(false);
  });

  it('handles different perPage values', () => {
    const pagination20: PaginationData = {
      page: 2,
      perPage: 20,
      itemCount: 25,
    };
    const pagination5: PaginationData = {
      page: 7,
      perPage: 5,
      itemCount: 25,
    };

    expect(hasPaginationError(pagination20)).toBe(false);
    expect(hasPaginationError(pagination5)).toBe(true);
  });

  it('returns false with single item on first page', () => {
    const pagination: PaginationData = {
      page: 1,
      perPage: 10,
      itemCount: 1,
    };

    expect(hasPaginationError(pagination)).toBe(false);
  });
});
