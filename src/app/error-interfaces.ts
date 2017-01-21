// Compiler errors in webstorm IDE-->

declare interface Storage {
    setItem(key, value): void;
    getItem(key): any;

    setObject(key, value): void;
    getObject(key): any;
}

declare interface ResponsedData {
    __v: number;
    _id: string;
    content: string;
}

declare interface Data {
    message: string;
    obj: ResponsedData;
    user: User;
}

declare interface User {
    id: any;
    username: any;
    pictureUrl: any;
}