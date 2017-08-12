import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';

import { FindFriendService } from './findFriend.service';
import { Profile } from '../profile/profile';
import { ErrorService } from '../error/error.service';

@Component({
	selector: 'my-findFriend',
	templateUrl: 'findFriend.component.html'
})

export class FindFriendComponent implements OnInit {
	private foundUsers: Profile[] = [];
	private isLoading = false;
	private searchTerm = new FormControl();

	constructor(
		private _findFriendService: FindFriendService,
		private _errorService: ErrorService) { }

	ngOnInit() {
		const keyups = this.searchTerm.valueChanges
			.debounceTime(400)
			// no async call until the search term is the same (e.g. arrow keys would fire the subscribe method as well)
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

		keyups.subscribe(
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
}
