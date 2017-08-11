import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

import { Message } from './message';
import { NetworkService } from './../shared/network.service';

@Injectable()
export class MessageService {

	constructor(private networkService: NetworkService) { }

	addMessage(message: Message) {
		const BODY = JSON.stringify(message);

		return this.networkService.post(`message/add`, BODY)
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	getMessages(skipper) {
		return this.networkService.get(`message/${skipper}`)
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

		return this.networkService.delete(`message/${MESSAGEID}`)
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	editMessage(message: Message) {
		const BODY = JSON.stringify(message);
		const HEADERS = new Headers({ 'Content-Type': 'application/json' });

		return this.networkService.patch(`message/${message.messageId}`, BODY)
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	rateMessage(messageId, raterUserId, rating, prevRating) {
		// console.log('messageId: ' + messageId, 'userId: ' + raterUserId, 'rating: ' + rating);
		const RATINGOBJECT = JSON.stringify({ raterUserId: raterUserId, rating: rating, prevRating: prevRating });
		const HEADERS = new Headers({ 'Content-Type': 'application/json' });

		return this.networkService.patch(`message/rate/${messageId}`, RATINGOBJECT)
			.map((response: Response) => console.log(response.json()))
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
