
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorComponent } from './error.component';
import { ErrorService } from './error.service';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		ErrorComponent
	],
	exports: [
		ErrorComponent
	],
	providers: [
		ErrorService
	]
})
export class ErrorModule {

}