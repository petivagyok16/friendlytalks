import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { User } from '../auth/user';
import { Message } from '../message/message';
import { NetworkService } from './../shared/network.service';
import { AuthService } from './../auth/auth.service';
import { Error } from './../error/error';

@Injectable()
export class ProfileService {

	private apiUrl = '/api/v1/user';

	constructor(
		private networkService: NetworkService,
		private authService: AuthService,
	) { }

	// Finding the requested user profiles
	find(userId) {
		return this.networkService.get(`${this.apiUrl}/${userId}`)
			.then((response: any) => {
				const DATA = response.obj;

				let profile: User = {
					username: DATA.username,
					id: DATA.id,
					email: DATA.email,
					city: DATA.city,
					name: DATA.name,
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
		return this.networkService.get(`${this.apiUrl}/followers/${userId}`)
			.then((response: any) => {
				const rawFollowers = response.obj;
				const followers: any[] = [];

				rawFollowers.forEach(follower => {
					const mappedFollower: User = {
						username: follower.username,
						name: follower.name,
						id: follower._id,
						email: follower.email,
						pictureUrl: follower.pictureUrl
					};
					mappedFollower.name = follower.name;
					followers.push(mappedFollower);
				});

				return followers;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	getFollowing(userId) {
		return this.networkService.get(`${this.apiUrl}/following/${userId}`)
			.then((response: any) => {
				const rawFollowing = response.obj;
				const followings: any[] = [];

				rawFollowing.forEach(following => {
					const mappedFollowing: User = {
						username: following.username,
						name: following.name,
						id: following._id,
						messages: [],
						email: following.email,
						pictureUrl: following.pictureUrl
					};
					mappedFollowing.name = following.name;
					followings.push(mappedFollowing);
				});
				
				return followings;
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	getFollowingMessages(userId) {
		return this.networkService.get(`${this.apiUrl}/following-messages/${userId}`)
			.then((response: any) => {
				const rawFollowingMessages = response.obj;
				const followingMessages: any[] = [];

				rawFollowingMessages.forEach(following => {
					if (following.messages) {
						following.messages.forEach(message => {
							let mappedMessage: Message = {
								content: message.content,
								created_at: message.created_at,
								username: following.username,
								meta: message.meta,
								messageId: message._id,
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

		return this.networkService.patch(`${this.apiUrl}/edit/${userId}`, BODY)
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