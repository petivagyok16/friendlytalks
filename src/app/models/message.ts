import { PartialUser } from './partialuser';
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
	created_at: string;

	/**
	 * Meta contains the likes and dislikes.
	 */
	meta?: Meta;

	/**
	 * The user object who created the message
	 */
	partialUser: PartialUser;
}

interface Meta {
	likes: number;
	dislikes: number;
}
