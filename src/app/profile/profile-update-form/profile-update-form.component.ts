import {
	Component, OnInit, HostBinding,
	trigger, transition, animate, style, state
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Profile, UpdatedProfile } from '../profile';
import { ProfileService } from '../profile.service';
import { ErrorService } from '../../error/error.service';
import { StorageService } from './../../shared/storage.service';

@Component({
	selector: 'profile-form',
	templateUrl: 'profile-update-form.component.html'
})
export class ProfileUpdateFormComponent implements OnInit {

	public selectedUser: Profile = this.storageService.getObject('userObject');
	public form: FormGroup;

	constructor(private _router: Router,
		private _fb: FormBuilder,
		private _profileService: ProfileService,
		private _errorService: ErrorService,
		private storageService: StorageService) { }

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
		const UPDATED_PROFILE = new UpdatedProfile(this.form.value.pictureUrl,
			this.form.value.email, this.form.value.firstName, this.form.value.lastName,
			this.form.value.city);

		// updating profile client-side
		this.selectedUser.pictureUrl = this.form.value.pictureUrl;
		this.selectedUser.email = this.form.value.email;
		this.selectedUser.name.first = this.form.value.firstName;
		this.selectedUser.name.last = this.form.value.lastName;
		this.selectedUser.city = this.form.value.city;

		this.storageService.setObject('userObject', this.selectedUser);

		// sending the changes to the server
		this._profileService.editProfile(this.selectedUser.id, UPDATED_PROFILE)
			.then(data => console.log(data))
			.catch(error => {this._errorService.handleError(error)})
			
		// NAVIGATE TO PROFILE
		// navigate to feed at first, it will be fixed later cause client-side userObject must be updated
		this._router.navigate(['/profile', this.selectedUser.id]);
	}

	private isEmail(control: FormControl): { [s: string]: boolean } {
		if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
			return { invalidMail: true };
		}
	}
}
