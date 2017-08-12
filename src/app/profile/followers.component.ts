import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileService } from './profile.service';
import { ErrorService } from '../error/error.service';

@Component({
	selector: 'my-followers',
	template: `
<h2>Followers</h2>
           
<div class="col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-6 col-xs-offset-3 margin-top message-panel"  *ngFor="let user of followers">
    <div class="media">
        <div class="media-left">
            <a [routerLink]="['/profile', user.id]">
              <img class="media-object" [src]="user.pictureUrl" alt="...">
            </a>
        </div>
    <div class="media-body">
        <h4 class="media-heading"><a [routerLink]="['/profile', user.id]">@{{ user.username }}</a></h4>
        <div class="well well-sm white-bg well-margin-bottom">{{ user.name.first }}, {{ user.name.last }}</div>
        <div class="well well-sm white-bg well-margin-bottom">{{ user.email }}</div>
    </div>
    </div>
</div>`
})
export class FollowersComponent implements OnInit {

	public followers = [];
	private userId = null;
	constructor(private _profileService: ProfileService, private _route: ActivatedRoute, private _errorService: ErrorService) { }

	ngOnInit() {

		//getting the userId from URL param
		this._route.parent.params
			.map(params => params['userId'])
			.subscribe(
			(userId) => {
				this.userId = userId;
				console.log(userId);
				this._profileService.getFollowers(userId)
					.subscribe(followers => {
						this.followers = followers;
					},
					error => this._errorService.handleError(error));
			},
			error => this._errorService.handleError(error)
			);

		/*this._profileService.getFollowers(this.userId)
				.subscribe(followers => {
						this.followers = followers;
				},
				error => this._errorService.handleError(error)); */
	}

}