import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';

import { User } from '../auth/user';
import { NetworkService } from './../shared/network.service';
import { Error } from './../error/error';

@Injectable()
export class FindFriendService {

	constructor(private networkService: NetworkService) { }

	find(username) {
		return this.networkService.get(`find/${username}`)
			.then((response: any) => {
				const rawFoundUsers = response.obj;
				const foundUsers: any[] = [];

				rawFoundUsers.forEach(foundUser => {
					const mappedFoundUser: User = {
						username: foundUser.username,
						id: foundUser._id,
						name: foundUser.name,
						messages: foundUser.messages,
						email: foundUser.email,
						pictureUrl: foundUser.pictureUrl,
						city: foundUser.city
					};
					foundUsers.push(mappedFoundUser);
				});
				return foundUsers;
			})
			.catch((error: Error) => {
				throw error;
			});
	}
}
