import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  public async get(key: string) {
    return localStorage.getItem(key);
  }

  public async set(key: string, value: string) {
    return localStorage.setItem(key, value);
  }

  public async remove(key: string) {
    return localStorage.removeItem(key);
  }

  public async clear() {
    return localStorage.clear();
  }

  public setObject(key: string, value: any) {
		return localStorage.setItem(key, JSON.stringify(value));
  }
  
	public getObject(key: string) {
		const value = localStorage.getItem(key);
		return value && JSON.parse(value);
	}
}