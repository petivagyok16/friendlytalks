import { Component, OnInit, HostBinding,
    trigger, transition, animate, style, state }            from '@angular/core';

import { ActivatedRoute }                                   from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl }  from '@angular/forms';
import { Router }                                           from '@angular/router';

import { Profile, UpdatedProfile }                          from './profile';
import { ProfileService }                                   from './profile.service';
import { ErrorService }                                     from '../error/error.service';
import { ObjectStore }                                      from '../objectStore';

@Component({
    selector: 'profile-form',
    templateUrl: 'profileUpdateForm.component.html'
    /*,
     animations: [
     trigger('routeAnimation', [
     state('*',
     style({
     opacity: 1,
     transform: 'translateX(0)'
     })
     ),
     transition('void => *', [
     style({
     opacity: 0,
     transform: 'translateX(-100%)'
     }),
     animate('0.2s ease-in')
     ]),
     transition('* => void', [
     animate('0.5s ease-out', style({
     opacity: 0,
     transform: 'translateY(100%)'
     }))
     ])
     ])
     ] */
})
export class ProfileUpdateFormComponent implements OnInit{

    selectedUser: Profile = this._objectStore.getObject('userObject');
    form: FormGroup;

    //Animation
    /*
     @HostBinding('@routeAnimation') get display() {
     return true;
     }

     @HostBinding('style.display') get display() {
     return 'inline';
     }

     @HostBinding('style.position') get position() {
     return 'absolute';
     }
     */
    //

    constructor(private _router: Router,
                private _fb: FormBuilder,
                private _profileService: ProfileService,
                private _errorService: ErrorService,
                private _objectStore: ObjectStore) { }

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

        //updating profile client-side
        this.selectedUser.pictureUrl = this.form.value.pictureUrl;
        this.selectedUser.email = this.form.value.email;
        this.selectedUser.name.first = this.form.value.firstName;
        this.selectedUser.name.last = this.form.value.lastName;
        this.selectedUser.city = this.form.value.city;

        this._objectStore.setObject('userObject', this.selectedUser);

        //sending the changes to the server
        this._profileService.editProfile(this.selectedUser.id, UPDATED_PROFILE)
            .subscribe(data => console.log(data),
                error => this._errorService.handleError(error));
        //NAVIGATE TO PROFILE
        //navigate to feed at first, it will be fixed later cause client-side userObject must be updated
        this._router.navigate(['/profile', this.selectedUser.id]);
    }

    private isEmail(control: FormControl): {[s: string]: boolean} {
        if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
            return {invalidMail: true};
        }
    }

}