import {
	Component, OnInit, DoCheck, HostBinding,
	trigger, transition, animate, style, state, OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Profile } from '../profile';
import { ProfileService } from '../profile.service';
import { ErrorService } from '../../error/error.service';
import { ObjectStore } from '../../objectStore';

@Component({
	selector: 'selected-profile',
	templateUrl: 'selectedProfile.component.html'
	/*,
	animations: [
			trigger('routeAnimation', [
					state('*',
					style({
							opacity: 1,
							transform: 'translateX(0)'
					})
					),
					transition('void => *', [
							style({
									opacity: 0,
									transform: 'translateX(-100%)'
							}),
							animate('0.2s ease-in')
					]),
					transition('* => void', [
							animate('0.5s ease-out', style({
									opacity: 0,
									transform: 'translateY(100%)'
							}))
					])
			])
	] */
})
export class SelectedProfileComponent implements OnInit, DoCheck, OnDestroy {

	private selectedUserId = null;
	public userObject: Profile = null;
	// Initial values must be provided for ngFormModel otherwise component  crashes...
	public selectedUser = new Profile('init', 'init', [], 'init', 'init', 'init');
	public isFollowed = null;
	private selectedUserSubscription: Subscription;

	// Animation
	/*
	@HostBinding('@routeAnimation') get display() {
			return true;
	}

	@HostBinding('style.display') get display() {
			return 'inline';
	}

	@HostBinding('style.position') get position() {
			return 'absolute';
	}
	*/
	//

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _profileService: ProfileService,
		private _errorService: ErrorService,
		private _objectStore: ObjectStore) { }

	ngOnInit() {

		this.userObject = this._objectStore.getObject('userObject');

		// getting the userId from URL param
		this._route.parent.params
			.map(params => params['userId'])
			.subscribe(
			(userId) => {
				this.selectedUserId = userId;
			},
			error => this._errorService.handleError(error));

		// and then finding it by calling the server
		this.selectedUserSubscription = this._profileService.find(this.selectedUserId)
			.subscribe(profile => {
				this.selectedUser = profile;
				// localStorage userObject must be updated to track the changes of the followers
				if (this.isOwnProfile()) {
					this._objectStore.setObject('userObject', profile);
				}
			},
			error => this._errorService.handleError(error));

		// Checking whether the selected user is followed by the user or not
		this.isFollowed = this.userObject.relations.following.indexOf(this.selectedUserId) != -1;
	}

	ngDoCheck() {
		// console.log('Do check runs');

		// DoCheck is necessary here, because user can change the view to his own profile
		// but view wouldn't update, if a different profile is loaded.

		if (this.selectedUserId === this.userObject.id) {
			this.selectedUser = this.userObject;
		}
	}

	// edit button will be available if the selected user profile is the user's own profile
	isOwnProfile() {
		return this.selectedUserId == localStorage.getItem('userId');
	}

	editProfile() {
		this._router.navigate(['update-profile-form']);
	}

	onFollowChange(newState) {

		// Changing the follower's state server-side
		this._profileService.follow(localStorage.getItem('userId'), this.selectedUserId, newState.state)
			.subscribe(null,
			error => this._errorService.handleError(error));

		// Changing the follower / following states client-side:
		if (newState.state === true) {

			// by adding the followers and followings to the proper users

			this.userObject.relations.following.push(this.selectedUserId);
			this.selectedUser.relations.followers.push(this.userObject.id);

			// since its a userObject changer operation localStorage.userObject must be updated
			// to keep both the client and server side in sync
			this._objectStore.setObject('userObject', this.userObject);

		} else {

			// by deleting the followers and followings from the proper users

			const followingIndex = this.userObject.relations.following.indexOf(this.selectedUserId);
			const followerIndex = this.selectedUser.relations.followers.indexOf(this.userObject.id);

			this.userObject.relations.following.splice(followingIndex, 1);
			this.selectedUser.relations.followers.splice(followerIndex, 1);

			this._objectStore.setObject('userObject', this.userObject);

		}
	}

	ngOnDestroy() {
		this.selectedUserSubscription.unsubscribe();
	}
}