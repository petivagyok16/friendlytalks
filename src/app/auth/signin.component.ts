import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
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
	</form>
`
})
export class SigninComponent implements OnInit {

	public signinForm: FormGroup;

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
		this._authService.signin({ username: this.signinForm.value.username, password: this.signinForm.value.password })
			.then(authenticatedUser => {
				this.storageService.setObject('userObject', authenticatedUser);
				// Since i use only the localStored userId its necessary to store it separately.
				this.storageService.set('userId', authenticatedUser.id);
				this.storageService.set('username', authenticatedUser.username);
				this.storageService.set('pictureUrl', authenticatedUser.pictureUrl);

				this._router.navigateByUrl('/feed');
			})
			.catch(error => this._errorService.handleError(error));
	}
}