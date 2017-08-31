import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthService } from './../auth/auth.service';
import { StorageService } from './storage.service';
import { User } from './../auth/user';

@Component({
	selector: 'my-profilebar',
	template: `
		<ul class="nav navbar-nav navbar-right">
				<li class="dropdown">
						<a href="#" class="dropdown-toggle profile-image" data-toggle="dropdown">
								<img [src]="user.pictureUrl" class="img-circle profile-picture"> {{ user.username }} <b class="caret"></b>
						</a>
				<ul class="dropdown-menu">
						<li><a [routerLink]="['/profile', user.id]" routerLinkActive="active"><i class="fa fa-cog"></i> Profile</a></li>
						<li><a routerLink = '/update-profile-form' routerLinkActive="active"><i class="fa fa-pencil"></i> Edit Profile</a></li>
																																										
						<li role="separator" class="divider"></li>
						<li><a routerLink="/" (click)="logout()"><i class="fa fa-sign-out"></i> Sign out</a></li>
				</ul>
				</li>
		</ul>
	`
})
export class ProfileBarComponent implements OnInit {
	public user: User = this.auth.authenticatedUser.getValue();

	constructor(
		private storageService: StorageService,
		private auth: AuthService,
		private router: Router
	) { }

	ngOnInit() {
	}

	logout() {
		return this.auth.logout().then(() => {
			this.router.navigateByUrl('/');			
		});
	}

}