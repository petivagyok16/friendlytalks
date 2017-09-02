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
			.then((response: any) => response)
			.catch((error: Response) => {
				console.error(error);
				throw error;
			});
	}

	getMessages(skipper): Promise<any> {
		return this.networkService.get(`message/${skipper}`)
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
			.catch((error: Response) => console.error(error));
	}

	deleteMessage(message: Message) {
		const MESSAGEID = message.messageId;

		return this.networkService.delete(`message/${MESSAGEID}`)
			// .then((response: Response) => response)
			.catch((error: Response) => {
				throw error;
			});
	}

	editMessage(message: Message) {
		const BODY = JSON.stringify(message);

		return this.networkService.patch(`message/${message.messageId}`, BODY)
			.then((response: Response) => response)
			.catch((error: Response) => {
				console.error(error);
				throw error;
			});
	}

	rateMessage(messageId, raterUserId, rating, prevRating) {
		const RATINGOBJECT = JSON.stringify({ raterUserId, rating, prevRating });

		return this.networkService.patch(`message/rate/${messageId}`, RATINGOBJECT)
			// .map((response: Response) => console.log(response))
			.catch((error: Response) => {
				console.error(error);
				throw error;
			});
	}
}
