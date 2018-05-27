import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, filter } from 'rxjs/operators';

import { StorageService } from './storage.service';
import { ErrorService } from './../error/error.service';
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
    const requestOptions = this.generateOptions(etag);
    const builtUrl = this.buildUrl(path, param, queryParams);
    return this.http.get<T>(builtUrl, requestOptions)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  /**
   * @param path path/to/endpoint
   * @param body post request body
   */
  public post<T>(path: string, body: Object = {}): Promise<T> {
    const requestOptions = this.generateOptions();
    const builtUrl = this.buildUrl(path, null);
    return this.http.post<T>(builtUrl, body, requestOptions)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  public patch<T>(path: string, body: Object = {}): Promise<T> {
    const requestOptions = this.generateOptions();
    const builtUrl = this.buildUrl(path, null);
    return this.http.patch<T>(builtUrl, body, requestOptions)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  public put<T>(path: string, body: Object = null): Promise<T> {
    const requestOptions = this.generateOptions();
    return this.http.put<T>(path, body, requestOptions)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  public delete<T>(path: string, param: string | number = '', queryParams: Object = {}): Promise<T> {
    const requestOptions = this.generateOptions();
    const builtUrl = this.buildUrl(path, param, queryParams);
    return this.http.delete<T>(builtUrl, requestOptions)
      .toPromise()
      .catch(this.handleGlobalError);
  }

  private generateOptions(etag?: string) {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', this._token);

      if (this._token) {
        headers = Object.assign(headers, headers.set('Authorization', `Bearer ${this._token}`));
      }

      if (etag) {
        headers = Object.assign(headers, headers.set('If-None-Match', etag));
      }

      const options = {
        headers: headers,
      };

    return options;
  }

  private buildUrl(path: string, param: string | number, queryParams: Object = {}): string {
    let requestParam = param ? '/' + param : '';
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
    console.log(`Http Error occurred: `, error);
    throw error;
  }
}

