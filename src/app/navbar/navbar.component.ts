import { Component, OnInit, DoCheck } from '@angular/core';

import { StorageService } from '../shared/storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
	selector: 'my-navbar',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnInit, DoCheck {
	public userId: any;
	public landingPage: any;

	constructor(
		private storageService: StorageService,
		private auth: AuthService,
	) { }

	ngOnInit() { }

	ngDoCheck() {
		this.userId = this.storageService.get('userId');
		this.landingPage = this.auth.isLoggedIn() ? '/announcements' : '';
	}

	logout() {
		this.auth.logout();
	}
}