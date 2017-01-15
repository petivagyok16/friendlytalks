import { Component, OnInit }                    from '@angular/core';
import { FormBuilder, FormGroup, Validators }   from '@angular/forms';
import { Router }                               from '@angular/router';

import { AuthService }                          from './auth.service';
import { User }                                 from './user';
import { ErrorService }                         from '../error/error.service';
import { ObjectStore }                          from '../objectStore';

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
export class SigninComponent implements OnInit {

    signinForm: FormGroup;

    constructor(private _fb: FormBuilder,
                private _router: Router,
                private _authService: AuthService,
                private _errorService: ErrorService,
                private _objectStore: ObjectStore) { }

    ngOnInit() {
        this.signinForm = this._fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]

        });

    }

    onSubmit() {
        const user = new User(this.signinForm.value.username, this.signinForm.value.password);

        this._authService.signin(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    this._objectStore.setObject('userObject', data.user);
                    //Since i use only the localStored userId its necessary to store it separately.
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('username', data.user.username);
                    localStorage.setItem('pictureUrl', data.user.pictureUrl);

                    this._router.navigateByUrl('/feed');
                },
                error => this._errorService.handleError(error));
    }

}