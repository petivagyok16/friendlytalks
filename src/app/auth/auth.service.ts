import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { NetworkService } from './../shared/network.service';
import { StorageService } from './../shared/storage.service';
import { User } from '../models/user';
import { Error } from './../error/error';

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

		return this.networkService.post('/auth/signup', BODY)
			.then((response: any) => {
				this.authenticatedUser.next(response.user);
				this.storageService.set('token', response.token);
				this.networkService.token = response.token;
				return response.user;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	public signin(credentials: { username: string, password: string }) {
		const BODY = JSON.stringify(credentials);

		return this.networkService.post<{ payload: User, token: string }>('/auth/signin', BODY)
			.then((response: any) => {
				this.authenticatedUser.next(response.payload);
				this.storageService.set('token', response.token);
				this.networkService.token = response.token;
				return response;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	public getAuthenticatedUser(): Promise<User> {
    console.log('AuthService -> Calling authenticated userdata from server');
    return this.networkService.get<{ payload: any, token: string }>('/auth/me').then(response => {
      const user: User = response.payload;
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
		this.networkService.token = null;
		return this.storageService.clear();
		// Reminder: if server throws "token must be unique" error delete the token object from the user document from mongolab
	}
}
