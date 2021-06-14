import Axios, {
  CancelToken,
  CancelTokenSource,
} from 'axios';
import {v4 as uuid} from "uuid";
import URI from 'urijs';
import { ErrorCode, CustomError } from 'models/CustomError';
import WebRoutes from "../routes/WebRoutes";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export class ApiService {
  private static instance = new ApiService();

  private requestMap = new Map<string, CancelTokenSource>();

  private unreportedErrors = [ErrorCode.UNAUTHORIZED, ErrorCode.NOT_FOUND];

  static getInstance() {
    return this.instance;
  }

  get(url: string, params?: any, headers?: any, requestId?: string) {
    return this.request({ method: 'GET', url, headers, params, requestId });
  }

  delete(url: string, params?: any, headers?: any, requestId?: string) {
    return this.request({ method: 'DELETE', url, headers, params, requestId });
  }

  post(
    url: string,
    data?: any,
    headers?: any,
    params?: any,
    requestId?: string,
  ) {
    return this.request({
      method: 'POST',
      url,
      data,
      headers,
      params,
      requestId,
    });
  }

  put(
    url: string,
    data?: any,
    useBaseUrl = true,
    useAuthHeaders = true,
    headers?: any,
    params?: any,
    requestId?: string,
  ) {
    return this.request({
      method: 'PUT',
      url,
      data,
      headers,
      params,
      requestId,
      useBaseUrl,
      useAuthHeaders,
    });
  }

  patch(
    url: string,
    data?: any,
    headers?: any,
    params?: any,
    requestId?: string,
  ) {
    return this.request({
      method: 'PATCH',
      url,
      data,
      headers,
      params,
      requestId,
    });
  }

  generateHeaders = (additionalHeaders: any, useAuthHeaders: boolean) => {
    const headers = {
      ...additionalHeaders,
    };

    if (useAuthHeaders) {
      headers.Authorization = localStorage.getItem('auth_token');
    }
    return { ...headers };
  };

  private async request({
    useBaseUrl = true,
    useAuthHeaders = true,
    ...config
  }) {
    const cancelToken = this.addToRequestMap(config.requestId);
    try {
      const response = await Axios.request({
        baseURL: useBaseUrl ? BASE_URL : undefined,
        cancelToken,
        ...config,
        headers: this.generateHeaders(config.headers, useAuthHeaders),
      });
      this.removeFromRequestMap(config.requestId);
      return response?.data;
    } catch (error) {
      const errorStatus = error?.response?.status;
      if (errorStatus === ErrorCode.UNAUTHORIZED) {
        // @ts-ignore
        window.location.href = new URI(WebRoutes.auth.login).query({
          redirect_to: URI().pathname(),
        });
      }
      if (this.shouldReportToSentry(errorStatus)) {
        // Report To sentry or any other service.
      }
      if (error.response && error.response.data) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
      throw CustomError.from(error);
    }
  }

  private shouldReportToSentry(errorStatus: ErrorCode) {
    return !this.unreportedErrors.includes(errorStatus);
  }

  private addToRequestMap(requestId?: string): CancelToken | undefined {
    if (!requestId) {
      return undefined;
    }

    const source = Axios.CancelToken.source();
    this.requestMap.set(requestId, source);
    return source.token;
  }

  private removeFromRequestMap(requestId?: string) {
    if (!requestId) {
      return;
    }

    this.requestMap.delete(requestId);
  }

  generateRequsetId(): string {
    return uuid();
  }

  cancelRequest(requestId: string) {
    const source = this.requestMap.get(requestId);
    source && source.cancel();
  }
}
