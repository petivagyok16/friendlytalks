import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { Profile } from '../profile/profile';

@Injectable()
export class FindFriendService {
	private _url: string = 'http://localhost:3000/find';
	private _token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

	constructor(private _http: Http) { }

	find(username) {
		return this._http.get(this._url + '/' + username + this._token)
			.map((response: Response) => {
				const DATA = response.json().obj;
				const objs: any[] = [];

				for (let i = 0; i < DATA.length; i++) {
					const foundUser = new Profile(DATA[i].username, DATA[i]._id, DATA[i].messages, DATA[i].email,
						DATA[i].pictureUrl, DATA[i].city);
					foundUser.name = DATA[i].name;

					objs.push(foundUser);
				}
				return objs;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
