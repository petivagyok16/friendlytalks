import { EventEmitter } from '@angular/core';

import { Error } from './error';

export class ErrorService {
	errorOccured = new EventEmitter<Error>();

	handleError(error: any) {
		console.error(`[ErrorService][HandleError]`, error);
		if (error.title && error.error) {
			const ERRORDATA = new Error(error.title, error.error.message);
			this.errorOccured.emit(ERRORDATA);
		} else {
			// console.log(error);
		}
	}
}