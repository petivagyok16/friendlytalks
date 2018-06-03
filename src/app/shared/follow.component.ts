import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'my-follow',
	template: `
	<button class="btn btn-padding"
		[class.btn-success]="!isFollowed"
		[class.btn-follow]="!isFollowed"
		[class.btn-danger]="isFollowed"
		[class.btn-unfollow]="isFollowed"
		(click)="onFollowClick()"><i class="glyphicon"
		[class.glyphicon-remove]="isFollowed"
		[class.glyphicon-ok]="!isFollowed"> </i>
		{{ isFollowed ? 'Unfollow' : 'Follow' }}
	</button>
	`
})
export class FollowComponent {

	@Input() isFollowed = false;
	@Output() change = new EventEmitter();

	constructor() { }

	onFollowClick() {
		this.isFollowed = !this.isFollowed;
		this.change.emit({ state: this.isFollowed });
	}
}
