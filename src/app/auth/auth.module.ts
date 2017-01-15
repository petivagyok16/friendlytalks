
import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService }                      from './auth.service';
import { LogoutComponent }                  from './logout.component';
import { SigninComponent }                  from './signin.component';
import { SignupComponent }                  from './signup.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        LogoutComponent,
        SigninComponent,
        SignupComponent
    ],
    exports: [
        LogoutComponent,
        SigninComponent,
        SignupComponent
    ],
    providers: [
        AuthService
    ]
})
export class AuthModule {

}