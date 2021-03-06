import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { ProfileService } from '../profile.service';
import { ErrorService } from '../../error/error.service';

@Component({
	selector: 'my-following',
	templateUrl: 'following.component.html'
})
export class FollowingComponent implements OnInit {

	public followings = [];
	private userId = null;
	constructor(
		private _profileService: ProfileService,
		private _route: ActivatedRoute,
		private _errorService: ErrorService) { }

	ngOnInit() {

		// getting the userId from URL param
		this._route.parent.params
			.pipe(
				map(params => params['userId']))
			.subscribe(
			(userId) => this.userId = userId,
			error => this._errorService.handleError(error));

		this._profileService.getFollowing(this.userId)
			.then(followings => {
				this.followings = followings;
			})
			.catch(error => this._errorService.handleError(error));
	}
}