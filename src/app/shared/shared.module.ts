
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FollowComponent } from './follow.component';
// import { PaginationComponent }    from './pagination.component';
import { ProfileBarComponent } from './profileBar.component';
import { RatingComponent } from './rating.component';
import { SpinnerComponent } from './spinner.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		FollowComponent,
		ProfileBarComponent,
		RatingComponent,
		SpinnerComponent,
	],
	exports: [
		FollowComponent,
		ProfileBarComponent,
		RatingComponent,
		SpinnerComponent,
	]
})
export class SharedModule {

}