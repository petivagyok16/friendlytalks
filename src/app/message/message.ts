export class Message {

	constructor(
		public content: string,
		public created_at: number,
		public username?: string,
		public meta?: Meta,
		public messageId?: string,
		public userId?: string,
		public pictureUrl?: string
	) { }

}

class Meta {
	public likes: number = 0;
	public dislikes: number = 0;
}