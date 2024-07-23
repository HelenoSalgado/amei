export enum Method {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export type TRouter = {
    method: Method,
    path: string
}

export type TReq<T> = {
    params: T;
    body: T
}

export type TBody = {
    param: string;
    allowDomain: string
}

export type TUser = {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string;
    email: string;
    password: string;
    role: string;
    allowDomains: TAllowDomain;
    createAt: Date;
    updatedAt: Date;
}

export type TUserAuth = {
    id: number;
    email: string;
    firstName: string;
    password: string;
    passwordInput: string;
    role: string; 
}

export type TAuth = {
    access_token?: string;
    message?: string;
    statusCode?: number;
    error?: string
}

export type TAllowDomain = {
    id?: number;
    domain: string;
    userId: number;
    posts: TPost[];
    user: TUser;
    createAt: Date;
    updatedAt: Date;
}

export type TPost = {
    id?: number;
    slug: string;
    views: number;
    likes: number;
    allowDomainId: number;
    allowDomain: string;
    createAt: Date;
    updatedAt: Date;
}