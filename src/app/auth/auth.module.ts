
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LogoutComponent } from './logout.component';
import { SigninComponent } from './signin.component';
import { SignupComponent } from './signup.component';

import { AuthGuard } from './auth-guard';
import { HttpInterceptorService } from './http-interceptor.service';
import { AuthService } from './auth.service';

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
		AuthService,
		AuthGuard,
		{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true, deps: [AuthService] },
	]
})
export class AuthModule { }
