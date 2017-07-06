import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LandingPageComponent } from './landingPage.component';
import { AnnouncementsComponent } from './announcements.component';
import { NotFoundComponent } from './not-found.component';

import { MessageComponent } from './message/message.component';
import { FindFriendComponent } from './findFriend/findFriend.component';
import { ProfileUpdateFormComponent } from './profile/profileUpdateForm.component';

import { SignupComponent } from './auth/signup.component';

//NEW ROUTER
const appRoutes: Routes = [
	{ path: 'announcements', component: AnnouncementsComponent },
	{ path: 'find', component: FindFriendComponent },
	{ path: 'update-profile-form', component: ProfileUpdateFormComponent },
	{ path: 'feed', component: MessageComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: '', component: LandingPageComponent },
	{ path: '**', component: NotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);