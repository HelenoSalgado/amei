import { AmeiError } from "../api/Error";
import { getManyAllowDomain } from "../api/service";
import msg from '../constants'
import { TRouter } from "../types";

export async function MiddlewareAllowOrigin({ headers, method: mtd }: Request, url: URL, router: TRouter[]) {
    let pathName = url.pathname.split('/');
    for(let { method, path } of router){
        if(method == mtd && (url.pathname == path || pathName.length > 2 && path.includes(':') && path.includes(pathName[1]))){
            let origin = headers.get('origin') as string;
            if(origin == null) throw new AmeiError(msg.originNotPresent, 401);
            const cacheKey = new Request('http://amei.com');
            const cache = caches.default;
            let allowDomainsInCache = await cache.match(cacheKey);
            if(!allowDomainsInCache){
                const allowDomain = (await getManyAllowDomain()).map(({ domain }) => { return domain });
                allowDomainsInCache = Response.json(allowDomain);
                allowDomainsInCache.headers.append('Cache-Control', 's-maxage=87000');
                await cache.put(cacheKey, allowDomainsInCache.clone());
            }
            const allowDomains = await allowDomainsInCache.json() as String[];
            if(!allowDomains.includes(origin)) throw new AmeiError(msg.domainNotFound, 401);
        }
    };
}