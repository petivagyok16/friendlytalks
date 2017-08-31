import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { Profile } from '../profile/profile';
import { NetworkService } from './../shared/network.service';

@Injectable()
export class FindFriendService {

	constructor(private networkService: NetworkService) { }

	find(username) {
		return this.networkService.get(`find/${username}`)
			.then((response: any) => {
				const rawFoundUsers = response.obj;
				const foundUsers: any[] = [];

				rawFoundUsers.forEach(foundUser => {
					const mappedFoundUser = new Profile(foundUser.username, foundUser._id, foundUser.messages, foundUser.email,
						foundUser.pictureUrl, foundUser.city);
					foundUsers.push(mappedFoundUser);
				});
				return foundUsers;
			})
			.catch((error: Response) => {
				throw error;
			});
	}
}
