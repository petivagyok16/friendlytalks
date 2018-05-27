import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Message } from './message';
import { NetworkService } from './../shared/network.service';
import { Error } from './../error/error';

@Injectable()
export class MessageService {
	private apiUrl = '/api/v1';

	constructor(private networkService: NetworkService) { }

	addMessage(message: Message) {
		const BODY = JSON.stringify(message);

		return this.networkService.post(`${this.apiUrl}/message/add`, BODY)
			.then((response: any) => response)
			.catch((error: Error) => {
				console.error(error);
				throw error;
			});
	}

	getMessages(skipper): Promise<any> {
		return this.networkService.get(`${this.apiUrl}/message/${skipper}`)
			.then((response: any) => {
				const messagesObj = response.obj;
				const messages: any[] = [];

				messagesObj.forEach(message => {
					const messageObject: Message = {
						content: message.content,
						created_at: message.created_at,
						username: message.user.username,
						meta: message.meta,
						messageId: message._id,
						userId: message.user._id,
						pictureUrl: message.user.pictureUrl
					};
					messages.push(messageObject);
				});
				return messages;
			})
			.catch((error: Error) => console.error(error));
	}

	deleteMessage(message: Message) {
		const MESSAGEID = message.messageId;

		return this.networkService.delete(`${this.apiUrl}/message/${MESSAGEID}`)
			// .then((response: Response) => response)
			.catch((error: Error) => {
				throw error;
			});
	}

	editMessage(message: Message) {
		const BODY = JSON.stringify(message);

		return this.networkService.patch(`${this.apiUrl}/message/${message.messageId}`, BODY)
			.then((response: Response) => response)
			.catch((error: Error) => {
				console.error(error);
				throw error;
			});
	}

	rateMessage(messageId, raterUserId, rating, prevRating) {
		const RATINGOBJECT = JSON.stringify({ raterUserId, rating, prevRating });

		return this.networkService.patch(`${this.apiUrl}/message/rate/${messageId}`, RATINGOBJECT)
			// .map((response: Response) => console.log(response))
			.catch((error: Error) => {
				console.error(error);
				throw error;
			});
	}
}
