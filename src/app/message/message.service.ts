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

	public addMessage<T>(message: EditedMessage): Promise<T> {
		return this.networkService.post<T>(`${this.apiUrl}/add`, message)
			.catch((error: Error) => {
				console.error(error);
				throw error;
			});
	}

	public getMessages(skipper): Promise<any> {
		return this.networkService.get<{ payload: Message[] }>(`${this.apiUrl}`) //TODO: add a limit, order query here
			.then(response => {
					return response.payload;
			})
			.catch((error: Error) => console.error(error));
	}

	public deleteMessage(message: Message) {
		return this.networkService.delete(`${this.apiUrl}/${message.id}`)
			// .then((response: Response) => response)
			.catch((error: Error) => {
				throw error;
			});
	}

	public editMessage(message: Message) {
		return this.networkService.patch(`${this.apiUrl}/${message.id}`, message)
			.then((response: Response) => response)
			.catch((error: Error) => {
				console.error(error);
				throw error;
			});
	}

	public rateMessage(messageId, raterUserId, rating) {
		return this.networkService.patch(`${this.apiUrl}/${messageId}/rate`, { raterUserId, rating })
			// .map((response: Response) => console.log(response))
			.catch((error: Error) => {
				console.error(error);
				throw error;
			});
	}
}
