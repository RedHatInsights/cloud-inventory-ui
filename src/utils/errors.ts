import { PaginationData } from '../types/pagination';

class HttpError extends Error {
  status: number;
  statusText: string;
  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}

const hasPaginationError = (pagination: PaginationData) => {
  return pagination.itemCount < (pagination.page - 1) * pagination.perPage;
};

export { HttpError, hasPaginationError };
