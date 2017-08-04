import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { NetworkService } from './../shared/network.service';
import { User } from './user';

@Injectable()
export class AuthService {

	constructor(private networkService: NetworkService) { }

	signup(user: User) {
		const BODY = JSON.stringify(user);

		return this.networkService.post('user/signup', BODY)
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	signin(user: User) {
		const BODY = JSON.stringify(user);

		return this.networkService.post('user/signin', BODY)
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
