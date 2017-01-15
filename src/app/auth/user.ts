export class User {

    name = new Name();

    constructor(
        public username: string,
        public password: string,
        public email?: string,
        public city?: string

    ) {}

}

export class Name {
    first: string = 'John';
    last: string = 'Doe';
}

//Webstorm would underline data.pictureUrl with red without this.
export class Data {
    pictureUrl: string;
}