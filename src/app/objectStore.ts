export class ObjectStore {
	setObject(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	}
	getObject(key) {
		const value = localStorage.getItem(key);
		return value && JSON.parse(value);
	}
}
