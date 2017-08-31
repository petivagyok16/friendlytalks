import { Component, OnInit, DoCheck } from '@angular/core';

import { StorageService } from '../shared/storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
	selector: 'my-navbar',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnInit, DoCheck {
	public user: any;
	public landingPage: any;

	constructor(
		private storageService: StorageService,
		private auth: AuthService,
	) { }

	ngOnInit() { }

	ngDoCheck() {
		this.user = this.auth.authenticatedUser.getValue();
		this.landingPage = this.auth.isAuthenticated() ? '/announcements' : '';
	}

	logout() {
		this.auth.logout();
	}

	isAuthenticated() {
		return this.auth.isAuthenticated();
	}
}