export interface ServerResponse {
  status: number;
  message: string;
}

export interface ServerApiResponse<T> {
  records: T[];
}
