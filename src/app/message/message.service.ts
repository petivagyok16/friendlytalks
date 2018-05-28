import { EditedMessage } from './../models/editedMessage';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Message } from '../models/message';
import { NetworkService } from './../shared/network.service';
import { Error } from './../error/error';

@Injectable()
export class MessageService {
	private apiUrl = '/api/v1/messages';

	constructor(private networkService: NetworkService) { }

	addMessage(message: EditedMessage) {
		const BODY = JSON.stringify(message);

		return this.networkService.post(`${this.apiUrl}/add`, BODY)
			.then((response: any) => response)
			.catch((error: Error) => {
				console.error(error);
				throw error;
			});
	}

	getMessages(skipper): Promise<any> {
		return this.networkService.get<{ payload: Message[] }>(`${this.apiUrl}`) //TODO: add a limit, order query here
			.then(response => {
				const messagesObj = response.payload;
				const messages: any[] = [];

				messagesObj.forEach(message => {
					const messageObject: Message = {
						content: message.content,
						created_at: message.created_at,
						username: message.user.username,
						meta: message.meta,
						messageId: message.id,
						userId: message.user.id,
						pictureUrl: message.user.pictureUrl
					};
					messages.push(messageObject);
				});
				return messages;
			})
			.catch((error: Error) => console.error(error));\
	}

	deleteMessage(message: Message) {
		const MESSAGEID = message.messageId;

		return this.networkService.delete(`${this.apiUrl}/${MESSAGEID}`)
			// .then((response: Response) => response)
			.catch((error: Error) => {
				throw error;
			});
	}

	editMessage(message: Message) {
		const BODY = JSON.stringify(message);

		return this.networkService.patch(`${this.apiUrl}/${message.messageId}`, BODY)
			.then((response: Response) => response)
			.catch((error: Error) => {
				console.error(error);
				throw error;
			});
	}

	rateMessage(messageId, raterUserId, rating, prevRating) {
		const RATINGOBJECT = JSON.stringify({ raterUserId, rating, prevRating });

		return this.networkService.patch(`${this.apiUrl}/${messageId}/rate`, RATINGOBJECT)
			// .map((response: Response) => console.log(response))
			.catch((error: Error) => {
				console.error(error);
				throw error;
			});
	}
}
