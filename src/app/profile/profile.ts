import { Name, User } from '../auth/user';

export class Profile implements User {

    name = new Name();
    relations = new Relations();
    ratings = new Ratings();
    password = null;

    constructor(public username: string,
                public id: string,
                public messages?: any[],
                public email?: string,
                public pictureUrl?: string,
                public city?: string
                ) {}
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

export class UpdatedProfile {

    constructor(
                public pictureUrl?: string,
                public email?: string,
                public firstName?: string,
                public lastName?: string,
                public city?: string
    ) {}
}
