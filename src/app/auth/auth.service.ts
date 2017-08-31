import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { NetworkService } from './../shared/network.service';
import { StorageService } from './../shared/storage.service';
import { User } from './user';

@Injectable()
export class AuthService {

	public authenticatedUser: BehaviorSubject<User> = new BehaviorSubject(undefined);
	public redirectUrl: string = '';

	constructor(
		private networkService: NetworkService,
		private storageService: StorageService
	) { }
	
	public isAuthenticated() {
		return !(this.authenticatedUser.getValue() === null || this.authenticatedUser.getValue() === undefined);
	}
	
	public getUser(): User {
		return this.authenticatedUser.getValue();
	}

	public signup(user: User) {
		const BODY = JSON.stringify(user);

		return this.networkService.post('user/signup', BODY)
			.then((response: any) => {
				this.authenticatedUser.next(response.user);
				this.storageService.set('token', response.token);
				this.networkService.token = response.token;
				return response.user;
			})
			.catch((error: Response) => {
				throw error;
			});
	}

	public signin(credentials: { username: string, password: string }) {
		const BODY = JSON.stringify(credentials);

		return this.networkService.post('user/signin', BODY)
			.then((response: any) => {
				console.log(`signin response: `, response);
				this.authenticatedUser.next(response.user);
				this.storageService.set('token', response.token);
				this.networkService.token = response.token;
				return response;
			})
			.catch((error: Response) => {
				throw error;
			});
	}

	public getAuthenticatedUser(): Promise<User> {
    console.log('AuthService -> Calling authenticated userdata from server');
    return this.networkService.get('/user/me').then((response: any) => {
      const user: User = response.user;
      console.log('AuthService -> Authenticated user has arrived', user);
      this.authenticatedUser.next(user);
      return user;
    })
      .catch(error => {
        this.authenticatedUser.next(null);
        console.error('AuthService -> Error during recieving authenticated user', error);
        if (error.status === 401) {
          console.error('AuthService -> Token is expired, delete it and signin out the user');
          this.storageService.remove('token');
          this.networkService.token = undefined;
        }
        throw error;
      });
  }

	public logout() {
		this.authenticatedUser.next(null);
		return this.storageService.clear();
		// TODO: create a logout endpoint that deleting the current token on the user document
	}
}
