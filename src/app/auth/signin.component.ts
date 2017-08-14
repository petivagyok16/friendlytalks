import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { AuthService } from './auth.service';
import { User } from './user';
import { ErrorService } from '../error/error.service';
import { StorageService } from './../shared/storage.service';

@Component({
	selector: 'my-signin',
	template: `
<form [formGroup]="signinForm" (ngSubmit)="onSubmit()" class="navbar-form navbar-right" role="sign-in" >
    <div class="form-group">
        <input formControlName="username" type="text" class="form-control" placeholder="Username">
    </div>
    <div class="form-group">
        <input formControlName="password" type="password" class="form-control" placeholder="Password"/>
    </div>
    <button type="submit" class="btn btn-success" [disabled]="!signinForm.valid">Sign in</button>
</form>`
})
export class SigninComponent implements OnInit, OnDestroy {

	public signinForm: FormGroup;
	private signinSubscription: Subscription;

	constructor(
		private _fb: FormBuilder,
		private _router: Router,
		private _authService: AuthService,
		private _errorService: ErrorService,
		private storageService: StorageService) { }

	ngOnInit() {
		this.signinForm = this._fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	onSubmit() {
		const user = new User(this.signinForm.value.username, this.signinForm.value.password);

		this.signinSubscription = this._authService.signin(user)
			.subscribe(
				data => {
					this.storageService.set('token', data.token);
					this.storageService.setObject('userObject', data.user);
					// Since i use only the localStored userId its necessary to store it separately.
					this.storageService.set('userId', data.user.id);
					this.storageService.set('username', data.user.username);
					this.storageService.set('pictureUrl', data.user.pictureUrl);

					this._router.navigateByUrl('/feed');
				},
				error => this._errorService.handleError(error));
	}

	ngOnDestroy() {
		this.signinSubscription.unsubscribe();
	}

}