import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { FindFriendService } from './find-friend.service';
import { ErrorService } from '../error/error.service';
import { User } from './../models/user';

@Component({
	selector: 'my-findFriend',
	templateUrl: 'find-friend.component.html'
})

export class FindFriendComponent implements OnInit, OnDestroy {
	public foundUsers: User[] = [];
	public isLoading = false;
	public searchTerm = new FormControl();
	private keyups: any;

	constructor(
		private _findFriendService: FindFriendService,
		private _errorService: ErrorService) { }

	ngOnInit() {
		this.keyups = this.searchTerm.valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged(),
				filter((text: string) => {
					if (text.length === 0) {
						this.foundUsers = [];
					} else {
						return text.length >= 2;
					}
				}),
				map(searchTerm => {
					return searchTerm;
				}));

		this.keyups.subscribe(
			searchTerm => {
				this.isLoading = true;
				this._findFriendService.find(searchTerm)
					.then(
					foundUsers => {
						if (foundUsers.length === 0) {
							this.foundUsers = null;
						} else {
							this.foundUsers = foundUsers;
						}
						this.isLoading = false;
					})
					.catch(error => {
						this._errorService.handleError(error);
						this.isLoading = false;
					});
			},
			error => console.log(error));
	}

	ngOnDestroy() {
		this.keyups.unsubscribe();
	}
}
