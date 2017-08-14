import { Component, OnInit } from '@angular/core';

import { AuthService } from './../auth/auth.service';
import { StorageService } from './storage.service';

@Component({
	selector: 'my-profilebar',
	template: `
		<ul class="nav navbar-nav navbar-right">
				<li class="dropdown">
						<a href="#" class="dropdown-toggle profile-image" data-toggle="dropdown">
								<img [src]="pictureUrl" class="img-circle profile-picture"> {{ username }} <b class="caret"></b>
						</a>
				<ul class="dropdown-menu">
						<li><a [routerLink]="['/profile', userId]" routerLinkActive="active"><i class="fa fa-cog"></i> Profile</a></li>
						<li><a routerLink = '/update-profile-form' routerLinkActive="active"><i class="fa fa-pencil"></i> Edit Profile</a></li>
																																										
						<li role="separator" class="divider"></li>
						<li><a routerLink="/" (click)="logout()"><i class="fa fa-sign-out"></i> Sign out</a></li>
				</ul>
				</li>
		</ul>
	`
})
export class ProfileBarComponent implements OnInit {
	public userId = this.storageService.get('userId');
	public username = this.storageService.get('username');
	public pictureUrl = this.storageService.get('pictureUrl');

	constructor(
		private storageService: StorageService,
		private auth: AuthService,
	) { }

	ngOnInit() {
	}

	logout() {
		return this.auth.logout();
	}

}