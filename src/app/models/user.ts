export interface User {
	/**
	 * Username of the user.
	 */
	username: string;

	/**
	 * Unique identifier of the user.
	 */
	id?: string;
	
	/**
	 * Password
	 */
	password?: string;
	
	/**
	 * Email
	 */
	email?: string;

	/**
	 * City
	 */
	city?: string;

	/**
	 * First name.
	 */
	firstName: string;

	lastName: string;

	/**
	 * Messages by the user.
	 */
	messages?: any[];

	/**
	 * Relations of the user.
	 */
	relations?: Relations;

	/**
	 * Ratings of the user.
	 */
	ratings?: Ratings;

	/**
	 * The picture of the user.
	 */
	pictureUrl?: string;
}

export interface Relations {
	followers: any[];
	following: any[];
}

export interface Ratings {
	my: RatingContainer;
	given: RatingContainer;
}

export interface RatingContainer {
	likes: any[];
	dislikes: any[];
}
