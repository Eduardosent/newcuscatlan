export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}