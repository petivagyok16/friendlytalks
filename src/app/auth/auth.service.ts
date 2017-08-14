import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { NetworkService } from './../shared/network.service';
import { StorageService } from './../shared/storage.service';
import { User } from './user';

@Injectable()
export class AuthService {

	constructor(
		private networkService: NetworkService,
		private storageService: StorageService
	) { }

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
		return this.storageService.clear();
	}

	isLoggedIn() {
		return this.storageService.get('token') !== null;
		// TODO use this everywhere
	}
}
