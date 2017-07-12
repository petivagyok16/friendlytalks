import { EventEmitter } from '@angular/core';

import { Error } from './error';

export class ErrorService {
	errorOccured = new EventEmitter<Error>();

	handleError(error: any) {
		// const ERROROBJ = error.json();
		console.error(`[ErrorService][HandleError]`, error);
		const ERRORDATA = new Error(error.title, error.error.message);
		this.errorOccured.emit(ERRORDATA);
	}
}