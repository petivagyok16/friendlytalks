import { Component, OnInit } from '@angular/core';

import { MessageService } from './message.service';
import { Message } from './message';
import { User } from '../auth/user';
import { Profile } from '../profile/profile';
import { ProfileService } from '../profile/profile.service';
import { ErrorService } from '../error/error.service';
import { StorageService } from './../shared/storage.service';
import { AuthService } from './../auth/auth.service';

@Component({
	selector: 'my-message',
	templateUrl: 'message.component.html'
})
export class MessageComponent implements OnInit {

	public messages: Message[] = [];
	public message: Message = null;
	// In the Config (Edit + Delete) section userId must be compared to the message's userId whether its the same or not.
	public userId = null;
	public globalFeedActive: boolean = true;
	public followerFeedActive: boolean = false;
	public messagesLoading: boolean = true;
	public userObject: User = null;
	private messageSkipper = 0;

	constructor(
		private _messageService: MessageService,
		private _profileService: ProfileService,
		private _errorService: ErrorService,
		private storageService: StorageService,
		private authService: AuthService
	) {
		this.userObject = this.authService.getUser();
		this.userId = this.authService.getUser().id;
	}

	ngOnInit() {
		this.messageSkipper = 0;

		this._messageService.getMessages(this.messageSkipper)
			.then(messages => {
				this.messages = messages;
				this.messagesLoading = false;
			})
			.catch(error => {
				this._errorService.handleError(error);
				this.messagesLoading = false;
			});
	}

	loadMoreMessage() {
		this.messageSkipper += 10;

		this._messageService.getMessages(this.messageSkipper)
			.then(newMessages => {
				this.messages = this.messages.concat(newMessages);
			})
			.catch(error => this._errorService.handleError(error));
	}

	sendMsg(input) {
		const inputValue = input.value;

		if (this.message) {
			// Edit message
			this.message.content = inputValue;
			this._messageService.editMessage(this.message)
				.then(data => {
					this.message = null
				})
				.catch(error => {
					this._errorService.handleError(error);
					this.message = null
				});
		} else {
			// Save new message
			const date = Date.now();
			const message = new Message(inputValue, date);

			this._messageService.addMessage(message)
				.then(data => {
					message.messageId = data.obj.id;
					message.username = data.obj.username;
					message.userId = data.obj.userId;
					message.meta = data.obj.meta;
					message.pictureUrl = data.obj.pictureUrl;
				})
				.catch(error => this._errorService.handleError(error));

			this.messages.unshift(message);
		}
		// clearing the input field -> 1 bug: after creating a message it cannot be edited at first, but
		// only after canceling at least once
		input.value = null;
	}

	onDelete(message) {
		this.messages.splice(this.messages.indexOf(message), 1);

		this._messageService.deleteMessage(message)
			.catch(error => this._errorService.handleError(error));
	}

	onEdit(message) {
		window.scrollTo(0,0);
		this.message = message;
	}

	onCancel() {
		this.message = null;
	}

	getGlobalMessages() {
		this.followerFeedActive = false;
		this.globalFeedActive = true;
		this.messageSkipper = 0;

		this._messageService.getMessages(this.messageSkipper)
			.then(messages => {
				// temporary workaround
				this.messages = [];
				// messages is an array, messageItems must be picked from it to push them into this.messages
				for (let messageItem of messages) {
					this.messages.push(messageItem);
				}
			})
			.catch(error => this._errorService.handleError(error));
	}

	getFollowingMessages() {
		this.globalFeedActive = false;
		this.followerFeedActive = true;

		this._profileService.getFollowingMessages(this.userObject.id)
			.then(messages => {
				this.messages = messages;
			})
			.catch(error => this._errorService.handleError(error));
	}

	calculateUserRating(messageId) {
		const user = this.authService.getUser();	
		// Liked message
		if (user.ratings.given.likes.indexOf(messageId) != -1) return 1;

		// Disliked message
		if (user.ratings.given.dislikes.indexOf(messageId) != -1) return 2;

		// No rating
		return 0;
	}

	messageRated(event, messageId) {
		// Changing message rating server-side
		this._messageService.rateMessage(messageId, this.userId, event.newRating, event.prevRating)
			.catch(error => this._errorService.handleError(error));
	}
}