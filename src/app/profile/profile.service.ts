import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

import { Profile, UpdatedProfile } from './profile';
import { User } from '../auth/user';
import { Message } from '../message/message';
import { NetworkService } from './../shared/network.service';
import { AuthService } from './../auth/auth.service';

@Injectable()
export class ProfileService {

	constructor(
		private networkService: NetworkService,
		private authService: AuthService,
	) { }

	// Finding the requested user profiles
	find(userId) {
		return this.networkService.get(`profile/${userId}`)
			.then((response: any) => {
				const DATA = response.obj;

				let profile = new User(
					DATA.username,
					DATA.id,
					null,
					DATA.email,
					DATA.city,
					DATA.name,
					DATA.messages,
					DATA.relations,
					DATA.ratings,
					DATA.pictureUrl);

				return profile;
			})
			.catch((error: Response) => {
				throw error;
			});
	}

	// by sending the followed and follower user's IDs i can set it server-side to
	// change both user's relation states in one http request
	follow(userId, toFollowId, state) {
		const toFollowOrUnfollow = JSON.stringify({ toFollowId: toFollowId, state: state });

		return this.networkService.patch(`profile/${userId}`, toFollowOrUnfollow)
			.catch((error: Response) => Observable.throw(error));
	}

	getFollowers(userId) {
		return this.networkService.get(`profile/followers/${userId}`)
			.then((response: any) => {
				const rawFollowers = response.obj;
				const followers: any[] = [];

				rawFollowers.forEach(follower => {
					const mappedFollower = new Profile(follower.username, follower._id, null, follower.email, follower.pictureUrl);
					mappedFollower.name = follower.name;
					followers.push(mappedFollower);
				});

				return followers;
			})
			.catch((error: Response) => {
				throw error;
			});
	}

	getFollowing(userId) {
		return this.networkService.get(`profile/following/${userId}`)
			.then((response: any) => {
				const rawFollowing = response.obj;
				const followings: any[] = [];

				rawFollowing.forEach(following => {
					const mappedFollowing = new Profile(following.username, following._id, [], following.email, following.pictureUrl);
					mappedFollowing.name = following.name;
					followings.push(mappedFollowing);
				});
				
				return followings;
			})
			.catch((error: Response) => {
				throw error;
			});
	}

	getFollowingMessages(userId) {
		return this.networkService.get(`profile/followingmessages/${userId}`)
			.then((response: any) => {
				const rawFollowingMessages = response.obj;
				const followingMessages: any[] = [];

				rawFollowingMessages.forEach(following => {
					if (following.messages) {
						following.messages.forEach(message => {
							let mappedMessage = new Message(message.content, message.created_at,
							following.username, message.meta, message._id, message.user, following.pictureUrl);
							followingMessages.push(message);
						});
					}
				})
				return followingMessages;
			})
			.catch((error: Response) => {
				throw error;
			});
	}

	editProfile(userId, profile: UpdatedProfile) {
		const BODY = JSON.stringify(profile);

		return this.networkService.patch(`profile/editprofile/${userId}`, BODY)
			.then((response: any) => {
				// TODO: check this out
				this.authService.authenticatedUser.next(response.obj);
			})
			.catch((error: Response) => {
				throw error;
			});
	}

}