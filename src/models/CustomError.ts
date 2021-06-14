import { AxiosError } from 'axios';

export enum ErrorCode {
  UNIDENTIFIED,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
}

export class CustomError {
  constructor(
    readonly message: string = 'Error. Please Try Again.',
    readonly status: ErrorCode = ErrorCode.UNIDENTIFIED,
    readonly errors: any = {},
    readonly data = {}
  ) {}

  static from(axiosError: AxiosError): CustomError {
    if (!axiosError.response) {
      return new CustomError();
    }

    const { status, data } = axiosError.response;
    if (status === ErrorCode.UNPROCESSABLE_ENTITY) {
      return new CustomError(data?.message, status, data?.errors, data?.data);
    }
    return new CustomError(data?.message, status, null, data?.data);
  }

  errorsByKey(key: string) {
    return this.errors?.[key];
  }

  hasErrorByKey(key: string) {
    return !!this.errorsByKey(key);
  }
}
