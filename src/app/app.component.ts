import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NetworkService } from './shared/network.service';
import { AuthService } from './auth/auth.service';
import { StorageService } from './shared/storage.service';
import { User } from './auth/user';

@Component({
	selector: 'my-app',
	template: `<router-outlet></router-outlet>`
})

export class AppComponent {
	constructor(
		private storageService: StorageService,
		private networkService: NetworkService,
		private authService: AuthService,
		private router: Router,
	) {
		this.storageService.get('token')
		.then(token => {
			console.log(`app cmp token: `, token);
			if (token) {
				this.networkService.token = token;
				this.authService.getAuthenticatedUser()
					.then((user: User) => {
						if (user) {
							this.router.navigate([this.authService.redirectUrl]);
						}
					})
					.catch(error => {
						console.error(`[appCmp][constructor] error during getting authenticatedUser()`, error);
						throw error;
					});
			}
		})
		.catch(error => {
			console.error(`[appCmp][constructor] error during getting the token`);
			throw error;
		});
	}
}