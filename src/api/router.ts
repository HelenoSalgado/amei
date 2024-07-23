import { AmeiError } from "./Error";

export class ameiRouter {
    private method: string;
    private url: URL;
    private request: Request;
    private req = {
        params: {} as any,
        body: { } as any
    }

    constructor(request: Request){
        this.request = request;
        this.method = request.method;
        this.url = new URL(request.url);
    }

    get(path: string, callback: Function){
        let pathname = this.getFullPath(path);
        if(path == pathname && this.method == 'GET'){
            return callback(this.req);
        } else {
            return;
        }
    }

    async post(path: string, callback: Function){
        if(path == this.url.pathname && this.method == 'POST'){
            this.req.body = await this.request.json();
            this.req.body.allowDomain = this.request.headers.get('origin') as string;
            return callback(this.req);
        } else {
            return
        }
    }

    async put(path: string, callback: Function){
        let pathname = this.getFullPath(path);
        if(path == pathname && this.method == 'PUT'){
            this.req.body = this.request.json();
            return callback(this.req);
        } else {
            return;
        }
    }

    delete(path: string, callback: Function){
        let pathname = this.getFullPath(path);
        if(path == pathname && this.method == 'DELETE'){
            return callback(this.req);
        } else {
            return
        }
    }

    use(callback: Function){
       throw new AmeiError('', 401);
    }

    getFullPath(path: string){
        let fullPath = this.url.pathname.split('/');
        if(fullPath.length > 2 && path.includes(':') && path.includes(fullPath[1])){
            let key = path.split(':')[1];
            this.req.params[key] = fullPath[2];
            return path
        }
        return this.url.pathname;
    }
}