import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { ProfileService } from '../profile.service';
import { ErrorService } from '../../error/error.service';

@Component({
	selector: 'my-followers',
	templateUrl: 'followers.component.html' 
})
export class FollowersComponent implements OnInit {

	public followers = [];
	private userId = null;
	constructor(private _profileService: ProfileService, private _route: ActivatedRoute, private _errorService: ErrorService) { }

	ngOnInit() {

		//getting the userId from URL param
		this._route.parent.params
			.pipe(
			map(params => params['userId']))
			.subscribe(
			(userId) => {
				this.userId = userId;
				this._profileService.getFollowers(userId)
					.then(followers => {
						this.followers = followers;
					})
					.catch(error => this._errorService.handleError(error))
			},
			error => this._errorService.handleError(error));
	}
}