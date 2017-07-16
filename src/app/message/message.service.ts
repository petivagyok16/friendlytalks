import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

import { Message } from './message';

@Injectable()
export class MessageService {

	private _url: string = 'http://localhost:3000/message';
	private _token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

	constructor(private _http: Http) { }

	addMessage(message: Message) {
		const BODY = JSON.stringify(message);
		const HEADERS = new Headers({ 'Content-Type': 'application/json' });

		return this._http.post(this._url + this._token, BODY, { headers: HEADERS })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	getMessages(skipper) {
		return this._http.get(this._url + '/' + skipper + this._token)
			.map((response: Response) => {
				const DATA = response.json().obj;
				console.log(DATA);
				const objs: any[] = [];

				for (let i = 0; i < DATA.length; i++) {
					const message = new Message(DATA[i].content, DATA[i].created_at, DATA[i].user.username, DATA[i].meta,
						DATA[i]._id, DATA[i].user._id, DATA[i].user.pictureUrl);
					objs.push(message);
				}
				return objs;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	deleteMessage(message: Message) {

		const MESSAGEID = message.messageId;

		return this._http.delete(this._url + '/' + MESSAGEID + this._token)
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	editMessage(message: Message) {
		const BODY = JSON.stringify(message);
		const HEADERS = new Headers({ 'Content-Type': 'application/json' });

		return this._http.patch(this._url + '/' + message.messageId + this._token, BODY, { headers: HEADERS })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	rateMessage(messageId, raterUserId, rating, prevRating) {
		// console.log('messageId: ' + messageId, 'userId: ' + raterUserId, 'rating: ' + rating);
		const RATINGOBJECT = JSON.stringify({ raterUserId: raterUserId, rating: rating, prevRating: prevRating });
		const HEADERS = new Headers({ 'Content-Type': 'application/json' });

		return this._http.patch(this._url + '/rate' + '/' + messageId + this._token, RATINGOBJECT, { headers: HEADERS })
			.map((response: Response) => console.log(response.json()))
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
