
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { profileRouting } from './profile.routing';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';
import { SelectedProfileComponent } from './selectedProfile/selectedProfile.component';
import { ProfileStatsComponent } from './profileStats/profileStats.component';
import { ProfileUpdateFormComponent } from './profileUpdateForm/profileUpdateForm.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		profileRouting
	],
	declarations: [
		ProfileComponent,
		ProfileStatsComponent,
		FollowersComponent,
		FollowingComponent,
		SelectedProfileComponent,
		ProfileUpdateFormComponent
	],
	providers: [
		ProfileService
	]
})
export class ProfileModule {

}