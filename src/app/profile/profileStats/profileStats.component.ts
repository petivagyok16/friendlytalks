import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { Ratings } from '../profile';

@Component({
	selector: 'my-ratio',
	templateUrl: 'profileStats.component.html'
})

export class ProfileStatsComponent implements OnChanges {
	@Input() ratings = new Ratings();

	myLikes: number = 0;
	myDislikes: number = 0;
	givenLikes: number = 0;
	givenDislikes: number = 0;

	constructor() { }

	// ngOnChanges is vital of this component's life, because selectedUser.ratings object arrives a little bit later and
	// the changes need to be tracked later as well.
	ngOnChanges() {
		// console.log(this.ratings);
		this.ratioCalc(this.ratings);
	}

	ratioCalc(ratingObj) {
		// My rating ratio
		const myTotal = ratingObj.my.likes.length + ratingObj.my.dislikes.length;
		this.myLikes = Number((ratingObj.my.likes.length / (myTotal / 100)).toFixed(1));
		this.myDislikes = Number((ratingObj.my.dislikes.length / (myTotal / 100)).toFixed(1));

		// Given ratings ratio
		const givenTotal = ratingObj.given.likes.length + ratingObj.given.dislikes.length;
		this.givenDislikes = Number((ratingObj.given.dislikes.length / (givenTotal / 100)).toFixed(1));
		this.givenLikes = Number((ratingObj.given.likes.length / (givenTotal / 100)).toFixed(1));
	}
}