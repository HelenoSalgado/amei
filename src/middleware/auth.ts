import { AmeiError } from "../api/Error";
import { TRouter } from "../types";
import { verify } from "../utils/auth";

export async function MiddlewareAuth({ headers, method: mtd }: Request, url: URL, router: TRouter[]) {
    let pathName = url.pathname.split('/');
    for(let { method, path } of router){
        if(method == mtd && (url.pathname == path || pathName.length > 2 && path.includes(':') && path.includes(pathName[1]))){
            const veri = await verify(headers.get('Authorization') as string);
            if(veri?.statusCode == 401) throw new AmeiError(veri.message as string, veri.statusCode);
            break;
        }
    };
}

