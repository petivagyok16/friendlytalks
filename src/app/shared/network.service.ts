import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class NetworkService {
  private baseUrl = 'http://localhost:8080';
  public _token: string;

  constructor(
    private http: HttpClient,
  ) { }

  set token(token: string) {
    this._token = token;
  }

  public get<T>(path: string, param: string | number = '', queryParams: Object = {}, etag?: string): Promise<T> {
    const builtUrl = this.buildUrl(path, param, queryParams);
    return this.http.get<T>(builtUrl)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  /**
   * @param path path/to/endpoint
   * @param body post request body
   */
  public post<T>(path: string, body: Object = {}): Promise<T> {
    const builtUrl = this.buildUrl(path, null);
    return this.http.post<T>(builtUrl, body)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  public patch<T>(path: string, body: Object = {}): Promise<T> {
    const builtUrl = this.buildUrl(path, null);
    return this.http.patch<T>(builtUrl, body)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  public put<T>(path: string, body: Object = null): Promise<T> {
    return this.http.put<T>(path, body)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  public delete<T>(path: string, param: string | number = '', queryParams: Object = {}): Promise<T> {
    const builtUrl = this.buildUrl(path, param, queryParams);
    return this.http.delete<T>(builtUrl)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  private buildUrl(path: string, param: string | number, queryParams: Object = {}): string {
    const requestParam = param ? '/' + param : '';
    return `${this.baseUrl}${path}${requestParam}${this.buildQueryParams(queryParams)}`;
  }

  /**
   *
   * @param queryParams contains the query parameters as key-value pairs.
   * If @param queryParams object is empty, return ''
   * otherwise return proper querystring parameter to the url
   */
  private buildQueryParams(queryParams: Object) {
    if (Object.keys(queryParams).length === 0) {
      return '';
    } else {
      return '?' + Object.keys(queryParams).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`;
      }).join('&');
    }
  }

  // TODO: implement global error handling here -> e.g: error.service & dialog.service
  private handleGlobalError(error: HttpErrorResponse): Promise<HttpErrorResponse | any> {
    throw error;
  }
}

