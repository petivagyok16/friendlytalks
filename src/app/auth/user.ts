export class User {

	constructor(
		public username: string,
		public id?: string,
		public password?: string,
		public email?: string,
		public city?: string,
		public name = new Name(),
		public messages?: any[],
		public relations?: Relations,
		public ratings?: Ratings,
		public pictureUrl?: string,

	) { }
}

class Relations {
	followers: any[] = [];
	following: any[] = [];
}

export class Ratings {
	my = new My();
	given = new Given();
}

class My {
	likes: any[] = [];
	dislikes: any[] = [];
}

class Given {
	likes: any[] = [];
	dislikes: any[] = [];
}

export class Name {
	first: string = 'John';
	last: string = 'Doe';
}

// Webstorm would underline data.pictureUrl with red without this.
export class Data {
	pictureUrl: string;
}