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
		return this.networkService.get<{ payload: User[] }>(`/api/v1/users/find/${username}`)
			.then(response => {
				const rawFoundUsers = response.payload;
				const foundUsers: User[] = [];

				rawFoundUsers.forEach(foundUser => {
					const mappedFoundUser: User = {
						username: foundUser.username,
						id: foundUser.id,
						firstName: foundUser.firstName,
						lastName: foundUser.lastName,
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
