import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { Ratings } from '../../models/user';

@Component({
	selector: 'my-ratio',
	templateUrl: 'profile-stats.component.html'
})

export class ProfileStatsComponent implements OnChanges {
	@Input() ratings: Ratings;

	public myLikes: number = 0;
	public myDislikes: number = 0;
	public givenLikes: number = 0;
	public givenDislikes: number = 0;

	constructor() { }

	// ngOnChanges is vital of this component's life, because selectedUser.ratings object arrives a little bit later and
	// the changes need to be tracked later as well.
	ngOnChanges() {
		if (this.ratings) {
			this.calculateRatio(this.ratings);
		}
	}

	private calculateRatio(ratingObj) {
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