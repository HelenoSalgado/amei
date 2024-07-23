import { Env } from "../worker-configuration";
import { ameiRouter } from "./api/router";
import { authentication, createAllowDomain, createLikes, createUser, deleteLikes, deleteUser, getAllowDomain, getLikes, getManyAllowDomain, getManyLikes, getManyUsers, getUser, updateLikes, updateUser, updateViews } from "./api/service";
import { AmeiError } from "./api/Error";
import { Method, TUserAuth, type TAllowDomain, type TPost, type TReq, type TUser } from "./types";
import { setProcessEnv } from "./utils/setProcessEnv";
import { MiddlewareAuth } from "./middleware/auth";
import { MiddlewareAllowOrigin } from "./middleware/origin";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<any> {
    // cria variável para armazenar todas as respostas
    const res = { data: {} };
    // set variáveis de tempo de execução (.toml)
    setProcessEnv(env);
    // instancia objeto de roteamento
    const app = new ameiRouter(request);

    try {
      // GRUD Post
      let resolve: boolean = false;

      await app.get('/likes/:slug', async(req: TReq<{slug: string}>) => {

		    const cacheKey = new Request(request.url, {method: 'GET'});
		    const cache = caches.default;
		    let response = await cache.match(cacheKey);

        if (!response) {
          res.data = await getLikes(req.params.slug) as TPost;
          setCache<TPost>(res.data as TPost);
          response = Response.json(res.data);   
        }
        res.data = response as any;
        resolve = true;
        ctx.waitUntil(updateViews(req.params.slug));
      });

      if(resolve) return res.data;

      await app.post('/users', async(req: TReq<Promise<TUser>>) => {
        res.data = await createUser(await req.body) as TUser;
        // Remove cache de domínios permitidos para que seja atualizado.
        const cacheKey = new Request('http://amei.com');
        ctx.waitUntil(caches.default.delete(cacheKey));
      });

      // Autentica usuário
      await app.post('/auth', async(req: TReq<Promise<TUserAuth>>) => {
        res.data = await authentication(await req.body) as TUserAuth;
      });

      // Verifica se a origem é permitida.
      await MiddlewareAllowOrigin(request, new URL(request.url), [
        { method: Method.POST, path: '/likes/:slug' },
        { method: Method.PUT, path: '/likes/:slug' }
      ]);

      await app.post('/likes', async(req: TReq<Promise<TPost>>) => {
        const { slug, allowDomain } = await req.body;
        res.data = await createLikes(allowDomain, slug) as any;
      });

      await app.put('/likes/:slug', async(req: TReq<{slug: string}>) => {
        res.data = await updateLikes(req.params.slug) as TPost;
        setCache<TPost>(res.data as TPost);
      });

      // Verifica se usuário está autenticado
      await MiddlewareAuth(request, new URL(request.url), [
        { method: Method.GET, path: '/users/:email' },
        { method: Method.PUT, path: '/users/:email' },
        { method: Method.DELETE, path: '/users/:email' },
        { method: Method.GET, path: '/allow-domains/:domain' },
        { method: Method.POST, path: '/allow-domains' },
        { method: Method.DELETE, path: '/likes/:slug' },
      ]);

      await app.delete('/likes/:slug', async(req: TReq<{slug: string}>) => {
        res.data = await deleteLikes(req.params.slug) as any;
      });

      await app.get('/allow-domains/:domain', async(req: TReq<{domain: string}>) => {
        res.data = await getAllowDomain(req.params.domain) as TAllowDomain;
      });

      await app.post('/allow-domains', async(req: TReq<Promise<TAllowDomain>>) => {
        const { domain, userId } = await req.body;
        res.data = await createAllowDomain(domain, userId) as any;
      });

      // GRUD Users
      await app.get('/users/:email', async(req: TReq<{email: string}>) => {
        res.data = await getUser(req.params.email) as TUser;
      });

      await app.put('/users/:email', async(req: TReq<any>) => {
        res.data = await updateUser(req.params.email as string, await req.body) as TUser;
      });

      await app.delete('/users/:email', async(req: TReq<{email: string}>) => {
        res.data = await deleteUser(req.params.email) as any;
      });

      await app.get('/users', async() => {
        res.data = await getManyUsers();
      });

      await app.get('/allow-domains', async() => {
        res.data = await getManyAllowDomain();
      });

      await app.get('/likes', async() => {
        res.data = await getManyLikes();
      });

    } catch (error: any) {
      return AmeiError.exception(error.statusText, error.status);
    }

    // Functions
    function setCache<T>(data: T){
      // Inicia API caches
      const cache = caches.default;
      // Cria novo objeto de resposta
      let response = Response.json(data);
      // Instancia uma chave para identificar novo objeto atualizado em cache
      const cacheKey = new Request(request.url, {method: 'GET'});
      // Atribui controle de cache ao header de resposta: s-max-age to 87000
      response.headers.append('Cache-Control', 's-maxage=87000');
      // Extende o fluxo de execução normal do worker e atualiza o cache
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return Response.json(res.data);
  }
};