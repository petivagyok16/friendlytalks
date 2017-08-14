import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { FindFriendComponent } from './find-friend.component';
import { FindFriendService } from './find-friend.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		FindFriendComponent
	],
	exports: [
		FindFriendComponent
	],
	providers: [
		FindFriendService
	]
})
export class FindFriendModule {

}