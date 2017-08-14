import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { MessageComponent } from './message/message.component';
import { FindFriendComponent } from './find-friend/find-friend.component';
import { ProfileUpdateFormComponent } from './profile/profile-update-form/profile-update-form.component';
import { SignupComponent } from './auth/signup.component';

import { AuthGuard } from './nav-guards/auth-guard';

const appRoutes: Routes = [
	{
		path: '',
    component: AppComponent,
    children: [
			{ path: 'announcements', component: AnnouncementsComponent },
			{ path: 'find', canActivate: [AuthGuard], component: FindFriendComponent },
			{ path: 'update-profile-form', canActivate: [AuthGuard], component: ProfileUpdateFormComponent },
			{ path: 'feed', canActivate: [AuthGuard], component: MessageComponent },
			{ path: 'signup', component: SignupComponent },
			{ path: '', component: LandingPageComponent },
			{ path: '**', component: NotFoundComponent }
		]
	}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);