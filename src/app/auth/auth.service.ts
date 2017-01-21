import { Injectable }                         from '@angular/core';
import { Http, Headers, Response }            from '@angular/http';
import { Observable }                         from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { User }                               from './user';

@Injectable()
export class AuthService {

    private _url = 'http://localhost:3000/user';

    constructor(private _http: Http) {}

    signup(user: User) {

        const BODY = JSON.stringify(user);
        const HEADERS = new Headers({'Content-Type':'application/json'});

        return this._http.post(this._url, BODY, {headers: HEADERS})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));

    }

    signin(user: User) {
        const BODY = JSON.stringify(user);
        const HEADERS = new Headers({'Content-Type':'application/json'});

        return this._http.post(this._url + '/signin', BODY, {headers: HEADERS})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));

    }

    logout() {
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}
