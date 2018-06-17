import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { SelectedProfileComponent } from './selected-profile/selected-profile.component';
import { ProfileUpdateFormComponent } from './profile-update-form/profile-update-form.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';
import { AuthGuard } from '../auth/auth-guard';

const profileRoutes: Routes = [
	{
		path: 'profile/:userId', canActivate: [AuthGuard], children: [
			{ path: '', component: SelectedProfileComponent },
			// { path: 'update-profile-form', component: ProfileUpdateFormComponent },
			{ path: 'followers', component: FollowersComponent },
			{ path: 'following', component: FollowingComponent },
		], component: ProfileComponent
	},
];

export const profileRouting: ModuleWithProviders = RouterModule.forChild(profileRoutes);
