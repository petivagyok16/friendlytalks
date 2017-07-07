import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'my-landingPage',
	template: `
		<div class="container-fluid jumbotron">
				<div class="row col-md-4">
						<h2> Welcome to Friendly Talks!</h2>
						<p>Don't have account?</p>
						<a routerLink="/signup"><h3>Sign up!</h3></a>
				</div>
		</div>
`
})
export class LandingPageComponent implements OnInit {
	constructor() { }

	ngOnInit() { }

}