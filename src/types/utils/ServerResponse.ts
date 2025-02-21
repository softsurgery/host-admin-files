export interface ServerResponse {
  status: number;
  message: string;
}

export interface ServerFileUploadResponse extends ServerResponse {
  file: string;
}

export interface ServerFileResponse {
  status: number;
  results: ServerFileUploadResponse[];
}

export interface ServerApiResponse<T> {
  records: T[];
  results?: number;
}
