import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

@Injectable()
export class NetworkService {

  private url: string = 'http://localhost:3000';

  constructor(private http: Http) {
    
  }

  post(path: string, payload: any = null) {
    return this.http.post(this.createUrl(path, {}), payload, this.createRequestOptions());
  }

  get(path: string, params: any = {}) {
    return this.http.get(this.createUrl(path, params), this.createRequestOptions());
  }

  patch(path: string, payload: any = null) {
    return this.http.patch(this.createUrl(path, {}), payload, this.createRequestOptions());
  }

  delete(path: string, params: any = {}) {
    return this.http.delete(this.createUrl(path, params), this.createRequestOptions());
  }

  createRequestOptions() {
    let requestOptions = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    });
    return requestOptions;
  }

  // TODO: handle params if necessary in the future
  private createUrl(path: string, params: any): string {
   let token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

    if (path.indexOf('/') == 0) {
      return `${this.url}${path}${token}`;
    } else {
      return `${this.url}/${path}${token}`;
    }
  }
  

}
