import { env } from "../config/env";
import { TAuth, TUserAuth } from "../types";


export async function verify(authorization: string):Promise<TAuth>{
    return await fetch(`${env.host}auth/verify`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization
        },
    }).then(async(res) => { return await res.json() as TAuth });
}

export async function auth(user: TUserAuth): Promise<TAuth> {
    return await fetch(`${env.host}auth`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    }).then(async(res) => await res.json() as TAuth)
}

export async function getHashPassword(password: string) {
    return await fetch(`${env.host}auth/hash`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({password})
    }).then(async(res) => {
        return await res.json() as { password: string };
    });
}