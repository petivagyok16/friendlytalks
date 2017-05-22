import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { SelectedProfileComponent } from './selectedProfile.component';
import { ProfileUpdateFormComponent } from './profileUpdateForm.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';

const profileRoutes: Routes = [
	{
		path: 'profile/:userId', children: [
			{ path: '', component: SelectedProfileComponent },
			// { path: 'update-profile-form', component: ProfileUpdateFormComponent },
			{ path: 'followers', component: FollowersComponent },
			{ path: 'following', component: FollowingComponent },
		], component: ProfileComponent
	},
];

export const profileRouting: ModuleWithProviders = RouterModule.forChild(profileRoutes);