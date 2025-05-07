export interface ApiResponseInterface<T> {
  statusCode: number;
  data: T;
}

export interface ErrorResponseInterface {
  statusCode: number;
  error: any;
}
