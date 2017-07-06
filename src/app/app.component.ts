import { Component } from '@angular/core';

@Component({
	selector: 'my-app',
	template: `
		<div class="container-fluid">
				<my-navbar></my-navbar>
				<router-outlet></router-outlet>
		</div>
		<my-error></my-error>
`
})

export class AppComponent {
	constructor() {

	}
}