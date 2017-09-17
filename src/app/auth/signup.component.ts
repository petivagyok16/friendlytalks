import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from './user';
import { AuthService } from './auth.service';
import { ErrorService } from '../error/error.service';

@Component({
	selector: 'my-signup',
	templateUrl: 'signup.component.html'
})

export class SignupComponent implements OnInit {

	public signupForm: FormGroup;

	constructor(
		private _fb: FormBuilder,
		private _authService: AuthService,
		private _router: Router,
		private _errorService: ErrorService
	) { }

	ngOnInit() {

		this.signupForm = this._fb.group({
			username: ['', Validators.required],
			email: ['', Validators.compose([
				Validators.required,
				this.isEmail
			])],
			password: ['', Validators.required],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			city: ['', Validators.required]
		});
	}

	onSubmit() {
		const val = this.signupForm.value;

		const USER: User = {
			username: val.username,
			password: val.password,
			email: val.email,
			city: val.city,
			name: {first: val.firstName, last: val.lastName}
		};

		this._authService.signup(USER)
			// .then(user => console.log(user))
			.catch(error => this._errorService.handleError(error));

		this._router.navigateByUrl('/feed');
	}

	private isEmail(control: FormControl): { [s: string]: boolean } {
		if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
			return { invalidMail: true };
		}
	}

}