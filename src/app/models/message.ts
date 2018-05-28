import { User } from './../models/user';

export interface Message {
	/**
	 * Unique identifier
	 */
	id?: string;
	
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

	/**
	 * The user object who created the message
	 */
	user: User;
};

interface Meta {
	likes: number;
	dislikes: number;
};