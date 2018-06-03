import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { User } from '../models/user';
import { Message } from '../models/message';
import { NetworkService } from './../shared/network.service';
import { AuthService } from './../auth/auth.service';
import { Error } from './../error/error';

@Injectable()
export class ProfileService {

	private apiUrl = '/api/v1/users';

	constructor(
		private networkService: NetworkService,
		private authService: AuthService,
	) { }

	// Finding the requested user profiles
	public find(userId) {
		return this.networkService.get<{ payload: User }>(`${this.apiUrl}/${userId}`)
			.then(response => {
				return response.payload;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	public follow(userId, toFollowId, state) {
		return this.networkService.patch(`${this.apiUrl}/follower/${userId}/toFollow/${toFollowId}`)
			.catch((error: Error) => {
				throw error;
			});
	}

	public getFollowers(userId) {
		return this.networkService.get<{ payload: User[] }>(`${this.apiUrl}/${userId}/followers`)
			.then(response => {
				return response.payload;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	public getFollowing(userId) {
		return this.networkService.get<{ payload: User[] }>(`${this.apiUrl}/${userId}/following`)
			.then(response => {
				return response.payload;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	public getFollowingMessages(userId) {
		return this.networkService.get<{ payload: Message[] }>(`${this.apiUrl}/${userId}/following-messages`)
			.then(response => {
				return response.payload;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	public editProfile(userId, profile) {
		const BODY = JSON.stringify(profile);

		return this.networkService.patch<{ payload: User }>(`${this.apiUrl}/${userId}/edit`, BODY)
			.then(response => {
				this.authService.authenticatedUser.next(response.payload);
				return response.payload;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

}