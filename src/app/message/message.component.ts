import { Component, OnInit } from '@angular/core';

import { MessageService } from './message.service';
import { Message } from './message';
import { Profile } from '../profile/profile';
import { ProfileService } from '../profile/profile.service';
import { ErrorService } from '../error/error.service';
import { ObjectStore } from '../objectStore';

@Component({
    selector: 'my-message',
    templateUrl: 'message.component.html'
})
export class MessageComponent implements OnInit {

    messages: Message[] = [];
    message: Message = null;
    messagesCache: Message[] = null;
    // In the Config (Edit + Delete) section userId must be compared to the message's userId whether its the same or not.
    userId = localStorage.getItem('userId');
    globalFeedActive: boolean = true;
    followerFeedActive: boolean = false;
    messagesLoading: boolean = true;
    userObject: Profile = null;
    messageSkipper = 0;

    constructor(
        private _messageService: MessageService,
        private _profileService: ProfileService,
        private _errorService: ErrorService,
        private _objectStore: ObjectStore) { }

    ngOnInit() {

        this.messageSkipper = 0;

        this._messageService.getMessages(this.messageSkipper)
            .subscribe(
                messages => {
                    this.messages = messages;
            },
                error => this._errorService.handleError(error),
                () => {
                    this.messagesLoading = false;
            });

        this._profileService.find(this.userId)
            .subscribe(user => {
                this.userObject = user;
                this._objectStore.setObject('userObject', user);
            })
    }

    loadMoreMessage() {

        this.messageSkipper += 10;

        this._messageService.getMessages(this.messageSkipper)
            .subscribe(
                messages => {
                    // messages is an array, messageItems must be picked from it to push them into this.messages
                    for (let messageItem of messages) {
                        this.messages.push(messageItem);
                    }
            },
            error => this._errorService.handleError(error));
    }

    sendMsg(input) {

        const inputValue = input.value;

        if (this.message) {
            // Edit message
            this.message.content = inputValue;
            this._messageService.editMessage(this.message)
                .subscribe(
                data => console.log(data),
                error => this._errorService.handleError(error),
                () => this.message = null);

        } else {
            // Save new message
            const date = Date.now();
            const message = new Message(inputValue, date);

            this._messageService.addMessage(message)
                .subscribe(data => {
                    console.log(data);
                    message.messageId = data.obj.id;
                    message.username = data.obj.username;
                    message.userId = data.obj.userId;
                    message.meta = data.obj.meta;
                    message.pictureUrl = data.obj.pictureUrl;
                },
                error => this._errorService.handleError(error));

            this.messages.unshift(message);
        }
        // clearing the input field -> 1 bug: after creating a message it cannot be edited at first, but
        // only after canceling at least once
        input.value = null;

    }

    onDelete(message) {
        this.messages.splice(this.messages.indexOf(message), 1);

        this._messageService.deleteMessage(message)
            .subscribe(
                null,
                error => this._errorService.handleError(error));
    }

    onEdit(message) {
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
            .subscribe(messages => {
                // temporary workaround
                this.messages = [];
                // messages is an array, messageItems must be picked from it to push them into this.messages
                for (let messageItem of messages) {
                    this.messages.push(messageItem);
                }
            },
            error => this._errorService.handleError(error));
    }

    getFollowingMessages() {
        this.globalFeedActive = false;
        this.followerFeedActive = true;

        this._profileService.getFollowingMessages(this.userId)
            .subscribe(messages => {
                this.messages = messages;
            },
            error => this._errorService.handleError(error))
    }

    userRating(messageId) {
        // Liked message
        if (this.userObject.ratings.given.likes.indexOf(messageId) != -1) return 1;

        // Disliked message
        if (this.userObject.ratings.given.dislikes.indexOf(messageId) != -1) return 2;

        // No rating
        return 0;
    }

    messageRated(event, messageId) {
        // console.log(event);
        // console.log(messageId);

        // Changing message rating server-side
        this._messageService.rateMessage(messageId, this.userId, event.newRating, event.prevRating)
            .subscribe(null,
                error => this._errorService.handleError(error));
    }
}