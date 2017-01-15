export class Message {

    constructor(public content: string,
                public created_at: number,
                public username?: string,
                public meta = new Meta(),
                public messageId?: string,
                public userId?: string,
                public pictureUrl?: string
    ) {}

}

class Meta {

    public likes = 0;
    public dislikes = 0;

}