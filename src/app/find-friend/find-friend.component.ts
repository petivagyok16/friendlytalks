import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';

import { FindFriendService } from './find-friend.service';
import { Profile } from '../profile/profile';
import { ErrorService } from '../error/error.service';

@Component({
	selector: 'my-findFriend',
	templateUrl: 'findFriend.component.html'
})

export class FindFriendComponent implements OnInit, OnDestroy {
	public foundUsers: Profile[] = [];
	public isLoading = false;
	public searchTerm = new FormControl();
	private keyups: any;

	constructor(
		private _findFriendService: FindFriendService,
		private _errorService: ErrorService) { }

	ngOnInit() {
		this.keyups = this.searchTerm.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.filter(text => {
				if (text.length === 0) {
					this.foundUsers = [];
				} else {
					return text.length >= 2;
				}
			})
			.map(searchTerm => {
				return searchTerm;
			});

		this.keyups.subscribe(
			searchTerm => {
				this.isLoading = true;
				this._findFriendService.find(searchTerm)
					.subscribe(
					foundUsers => {
						if (foundUsers.length === 0) {
							this.foundUsers = null;
						} else {
							this.foundUsers = foundUsers;
						}
					},
					error => this._errorService.handleError(error),
					() => this.isLoading = false);
			},
			error => console.log(error));
	}

	ngOnDestroy() {
		this.keyups.unsubscribe();
	}
}
