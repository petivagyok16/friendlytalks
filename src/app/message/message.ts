// export class Message {

// 	constructor(
// 		public content: string,
// 		public created_at: number,
// 		public username?: string,
// 		public meta?: Meta,
// 		public messageId?: string,
// 		public userId?: string,
// 		public pictureUrl?: string
// 	) { }

// }


export interface Message {
	/**
	 * Unique identifier
	 */
	messageId?: string;
	
	/**
	 * The content of the message
	 */
	content: string;
	
	/**
	 * Date when the message was created.
	 */
	created_at: number;
	
	/**
	 * The creator of the message.
	 */
	username?: string;
	
	/**
	 * Meta contains the likes and dislikes.
	 */
	meta?: Meta;
	
	/**
	 * Unique identifier of the creator.
	 */
	userId?: string;
	
	/**
	 * Picture of the creator.
	 */
	pictureUrl?: string;
};

interface Meta {
	likes: number;
	dislikes: number;
};