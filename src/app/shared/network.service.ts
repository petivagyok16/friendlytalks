import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { StorageService } from './storage.service';
import { ErrorService } from './../error/error.service';

@Injectable()
export class NetworkService {

  private url: string = 'http://localhost:3000';
  public token: string = null;

  constructor(
    private http: Http,
    private storageService: StorageService,
    private errorService: ErrorService,
  ) {
    
  }

  post(path: string, payload: any = null): Promise<Response> {
    return this.http.post(this.createUrl(path, {}), payload, this.createRequestOptions()).toPromise()
      .then(response => {
        return response.json();
      })
      .catch(error => {
        this.errorService.handleError(error.json());
        throw error;
      });
  }

  get(path: string, params: any = {}): Promise<Response> {
    return this.http.get(this.createUrl(path, params), this.createRequestOptions()).toPromise()
    .then(response => {
      return response.json();
    })
    .catch(error => {
      this.errorService.handleError(error.json());
      throw error;
    });
  }

  patch(path: string, payload: any = null): Promise<Response> {
    return this.http.patch(this.createUrl(path, {}), payload, this.createRequestOptions()).toPromise()
    .then(response => {
      return response.json();
    })
    .catch(error => {
      this.errorService.handleError(error.json());
      throw error;
    });
  }

  delete(path: string, params: any = {}): Promise<Response> {
    return this.http.delete(this.createUrl(path, params), this.createRequestOptions()).toPromise()
    .then(response => {
      return response.json();
    })
    .catch(error => {
      this.errorService.handleError(error.json());
      throw error;
    });
  }

  createRequestOptions() {
    let requestOptions = new RequestOptions({
      headers: new Headers({
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
        'Authorization': this.token
      })
    });
    return requestOptions;
  }

  // TODO: handle params if necessary in the future
  private createUrl(path: string, params: any): string {
  //  let token = this.storageService.get('token') ? '?token=' + this.storageService.get('token') : '';

    if (path.indexOf('/') == 0) {
      return `${this.url}${path}`;
    } else {
      return `${this.url}/${path}`;
    }
  }
  

}
