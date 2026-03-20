// Common types used across the application

export type Status = "idle" | "loading" | "success" | "error";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: Status;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
