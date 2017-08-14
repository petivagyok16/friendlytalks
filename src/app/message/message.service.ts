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

		return this.networkService.post(`message/add`, BODY).toPromise()
			.then((response: Response) => response.json())
			.catch((error: Response) => {
				console.error(error.json());
				throw error.json();
			});
	}

	getMessages(skipper): Promise<any> {
		return this.networkService.get(`message/${skipper}`).toPromise()
			.then((response: Response) => {
				const messagesObj = response.json().obj;
				const messages: any[] = [];

				messagesObj.forEach(message => {
					const messageObject = new Message(message.content, message.created_at, message.user.username, message.meta,
						message._id, message.user._id, message.user.pictureUrl);
					messages.push(messageObject);
				});
				return messages;
			})
			.catch((error: Response) => console.error(error.json()));
	}

	deleteMessage(message: Message) {
		const MESSAGEID = message.messageId;

		return this.networkService.delete(`message/${MESSAGEID}`).toPromise()
			// .then((response: Response) => response.json())
			.catch((error: Response) => {
				throw error.json();
			});
	}

	editMessage(message: Message) {
		const BODY = JSON.stringify(message);

		return this.networkService.patch(`message/${message.messageId}`, BODY).toPromise()
			.then((response: Response) => response.json())
			.catch((error: Response) => {
				console.error(error.json());
				throw error.json();
			});
	}

	rateMessage(messageId, raterUserId, rating, prevRating) {
		const RATINGOBJECT = JSON.stringify({ raterUserId: raterUserId, rating: rating, prevRating: prevRating });

		return this.networkService.patch(`message/rate/${messageId}`, RATINGOBJECT)
			// .map((response: Response) => console.log(response.json()))
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
