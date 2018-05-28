import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from './../../models/user';
import { EditedUser } from './../../models/editedUser';
import { ProfileService } from '../profile.service';
import { ErrorService } from '../../error/error.service';
import { StorageService } from './../../shared/storage.service';

@Component({
	selector: 'profile-form',
	templateUrl: 'profile-update-form.component.html'
})
export class ProfileUpdateFormComponent implements OnInit {

	public selectedUser: User = this.authService.authenticatedUser.getValue();
	public form: FormGroup;

	constructor(private _router: Router,
		private _fb: FormBuilder,
		private _profileService: ProfileService,
		private _errorService: ErrorService,
		private authService: AuthService,
	) { }

	ngOnInit() {

		this.form = this._fb.group({
			pictureUrl: [''],
			email: ['', Validators.compose([
				Validators.required,
				this.isEmail
			])],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			city: ['', Validators.required],

		});
	}

	submit() {
		const val = this.form.value;

		const UPDATED_PROFILE: EditedUser = {
			pictureUrl: val.pictureUrl,
			email: val.email,
			firstName: val.firstName,
			lastName: val.lastName,
			city: val.city
		};

		this._profileService.editProfile(this.selectedUser.id, UPDATED_PROFILE)
			.then( (updatedUser: User) => {
				this._router.navigate(['/profile', this.selectedUser.id]);
			})
			.catch(error => {this._errorService.handleError(error)})
	}

	private isEmail(control: FormControl): { [s: string]: boolean } {
		if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
			return { invalidMail: true };
		}
	}
}
