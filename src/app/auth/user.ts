export class User {

	constructor(
		public username: string,
		public password?: string,
		public email?: string,
		public city?: string,
		public name?: Name,

	) { }
}

export class Name {
	first: string = 'John';
	last: string = 'Doe';
}

// Webstorm would underline data.pictureUrl with red without this.
export class Data {
	pictureUrl: string;
}