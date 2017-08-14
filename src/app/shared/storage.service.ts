import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  public get(key: string) {
    return localStorage.getItem(key);
  }

  public set(key: string, value: string) {
    return localStorage.setItem(key, value);
  }

  public remove(key: string) {
    return localStorage.removeItem(key);
  }

  public clear() {
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