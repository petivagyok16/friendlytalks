import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

import { Profile, UpdatedProfile } from './profile';
import { Message } from '../message/message';
import { NetworkService } from './../shared/network.service';

@Injectable()
export class ProfileService {

	constructor(private networkService: NetworkService) { }

	// Finding the requested user profiles
	find(userId) {
		return this.networkService.get(`profile/${userId}`)
			.map((response: Response) => {
				const DATA = response.json().obj;

				let profile = new Profile(DATA.username, DATA._id, DATA.messages, DATA.email, DATA.pictureUrl, DATA.city);
				profile.name = DATA.name;
				profile.relations = DATA.relations;
				profile.ratings = DATA.ratings;

				return profile;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	// by sending the followed and follower user's IDs i can set it server-side to
	// change both user's relation states in one http request
	follow(userId, toFollowId, state) {
		const toFollowOrUnfollow = JSON.stringify({ toFollowId: toFollowId, state: state });

		return this.networkService.patch(`profile/${userId}`, toFollowOrUnfollow)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	getFollowers(userId) {
		return this.networkService.get(`profile/followers/${userId}`)
			.map((response: Response) => {
				const rawFollowers = response.json().obj;
				const followers: any[] = [];

				rawFollowers.forEach(follower => {
					const mappedFollower = new Profile(follower.username, follower._id, null, follower.email, follower.pictureUrl);
					mappedFollower.name = follower.name;
					followers.push(mappedFollower);
				});

				return followers;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	getFollowing(userId) {
		return this.networkService.get(`profile/following/${userId}`)
			.map((response: Response) => {
				const rawFollowing = response.json().obj;
				const followings: any[] = [];

				rawFollowing.forEach(following => {
					const mappedFollowing = new Profile(following.username, following._id, [], following.email, following.pictureUrl);
					mappedFollowing.name = following.name;
					followings.push(mappedFollowing);
				});
				
				return followings;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	getFollowingMessages(userId) {
		return this.networkService.get(`profile/followingmessages/${userId}`)
			.map((response: Response) => {
				const rawFollowingMessages = response.json().obj;
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
			.catch((error: Response) => Observable.throw(error.json()));
	}

	editProfile(userId, profile: UpdatedProfile) {
		const BODY = JSON.stringify(profile);

		return this.networkService.patch(`profile/editprofile/${userId}`, BODY)
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

}