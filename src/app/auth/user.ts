export interface User {
	username: string;
	id?: string;
	password?: string;
	email?: string;
	city?: string;
	name: Name;
	messages?: any[];
	relations?: Relations;
	ratings?: Ratings;
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

interface RatingContainer {
	likes: any[];
	dislikes: any[];
}

interface Name {
	first: string;
	last: string;
}

export interface UpdatedUser {
	pictureUrl?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	city?: string;
}
