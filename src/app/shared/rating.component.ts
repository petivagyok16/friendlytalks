import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'my-rating',
	template: `
    <i (click)="rate(1)" class="fa fa-thumbs-up cursor-pointer" [class.like]="userRating === 1"></i> {{ ratingObj ? ratingObj.likes.length : 0 }} 
    <!-- <span (click)="rate(2)" class="cursor-pointer" [class.dislike]="userRating === 2" id="dislikeSpan">💩</span> {{ dislikes }} -->
    <i (click)="rate(2)" class="fa fa-thumbs-down cursor-pointer" [class.dislike]="userRating === 2"></i> {{ ratingObj ? ratingObj.dislikes.length : 0 }}
`
})

export class RatingComponent implements OnInit {
	@Input() userRating: number = 0;
	@Input() ratingObj;
	@Output() change = new EventEmitter();

	constructor() { }

	ngOnInit() {

	}

	rate(rating) {
		// i could use enum, but it doesnt work for some reason.
		const NO_RATING = 0;
		const LIKE = 1;
		const DISLIKE = 2;

		// sending previous Rating in order to determine where need to remove
		// the previous ratings from database, this prevents the necessity of using inefficient loops server-side
		// when it comes to NO_RATING case (because in that case we need to determine whether the
		// previous rating was LIKE or DISLIKE
		var prevRating: number = NO_RATING;

		switch (rating) {

			case LIKE:
				if (this.userRating === 2) {
					this.ratingObj.dislikes -= 1;
					prevRating = DISLIKE;
				}

				if (this.userRating === 1) {
					this.ratingObj.likes -= 1;
					this.userRating = 0;
					prevRating = LIKE;
					this.change.emit({ newRating: this.userRating, prevRating: prevRating });

					break;
				}

				this.ratingObj.likes += 1;
				this.userRating = 1;
				this.change.emit({ newRating: this.userRating, prevRating: prevRating });
				break;

			case DISLIKE:
				if (this.userRating === 1) {
					this.ratingObj.likes -= 1;
					prevRating = LIKE;
				}

				if (this.userRating === 2) {
					this.ratingObj.dislikes -= 1;
					this.userRating = 0;
					prevRating = DISLIKE;
					this.change.emit({ newRating: this.userRating, prevRating: prevRating });
					break;
				}

				this.ratingObj.dislikes += 1;
				this.userRating = 2;
				this.change.emit({ newRating: this.userRating, prevRating: prevRating });
				break;
		}
	}
}