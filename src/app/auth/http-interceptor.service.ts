import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHeaders, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone(this.getHeaders(req));
    return next.handle(request);
  }

  private getHeaders(req: HttpRequest<any>) {

    let headers: HttpHeaders = new HttpHeaders().append('Content-Type', 'application/json');

    if (!req.url.endsWith('/signin')) {
      headers = headers.append('Authorization', this.authService.getBearerToken());
    }

    return {
      headers: headers
    };
  }
}
