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
	find(userId) {
		return this.networkService.get(`${this.apiUrl}/${userId}`)
			.then((response: any) => {
				const DATA = response.obj;

				const profile: User = {
					username: DATA.username,
					id: DATA.id,
					email: DATA.email,
					city: DATA.city,
					firstName: DATA.firstName,
					lastName: DATA.lastName,
					messages: DATA.messages,
					relations: DATA.relations,
					ratings: DATA.ratings,
					pictureUrl: DATA.pictureUrl
				};

				return profile;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	// by sending the followed and follower user's IDs i can set it server-side to
	// change both user's relation states in one http request
	follow(userId, toFollowId, state) {
		const toFollowOrUnfollow = JSON.stringify({ toFollowId: toFollowId, state: state });

		return this.networkService.patch(`profile/${userId}`, toFollowOrUnfollow)
			.catch((error: Error) => Observable.throw(error));
	}

	getFollowers(userId) {
		return this.networkService.get(`${this.apiUrl}/${userId}/followers`)
			.then((response: any) => {
				const rawFollowers = response.obj;
				const followers: any[] = [];

				rawFollowers.forEach(follower => {
					const mappedFollower: User = {
						username: follower.username,
						firstName: follower.firstName,
						lastName: follower.lastName,
						id: follower._id,
						email: follower.email,
						pictureUrl: follower.pictureUrl
					};
					mappedFollower.firstName = follower.firstName;
					mappedFollower.lastName = follower.lastName;
					followers.push(mappedFollower);
				});

				return followers;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	getFollowing(userId) {
		return this.networkService.get(`${this.apiUrl}/${userId}/following`)
			.then((response: any) => {
				const rawFollowing = response.obj;
				const followings: any[] = [];

				rawFollowing.forEach(following => {
					const mappedFollowing: User = {
						username: following.username,
						firstName: following.firstName,
						lastName: following.lastName,
						id: following._id,
						messages: [],
						email: following.email,
						pictureUrl: following.pictureUrl
					};
					mappedFollowing.firstName = following.firstName;
					mappedFollowing.lastName = following.lastName;
					followings.push(mappedFollowing);
				});
				
				return followings;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	getFollowingMessages(userId) {
		return this.networkService.get(`${this.apiUrl}/${userId}/following-messages`)
			.then((response: any) => {
				const rawFollowingMessages = response.obj;
				const followingMessages: any[] = [];

				rawFollowingMessages.forEach(following => {
					if (following.messages) {
						following.messages.forEach(message => {
							const mappedMessage: Message = {
								content: message.content,
								created_at: message.created_at,
								username: following.username,
								meta: message.meta,
								id: message.id,
								userId: message.user,
								pictureUrl: following.pictureUrl
							};
							followingMessages.push(message);
						});
					}
				})
				return followingMessages;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	editProfile(userId, profile) {
		const BODY = JSON.stringify(profile);

		return this.networkService.patch(`${this.apiUrl}/${userId}/edit`, BODY)
			.then((response: any) => {
				// TODO: check this out
				this.authService.authenticatedUser.next(response.obj);
				return response.obj;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

}